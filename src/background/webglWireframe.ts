import { makeWireGeometry, type WireGeometry } from './geometry'

export interface WireRenderOptions {
  time: number
  alpha: number
  strokeAlpha: number
  pointAlpha: number
  glowAlpha: number
  beamWidth: number
  beamBrighten: number
  rotation: number
  x: number
  y: number
  size: number
  beamY: number
  pointer: { x: number; y: number; active: boolean }
}

export interface WebGLWireframe {
  resize(width: number, height: number, dpr: number): void
  render(options: WireRenderOptions): void
  destroy(): void
}

const sparseGeo = makeWireGeometry(false)
const denseGeo = makeWireGeometry(true)

const VERTEX = `
attribute vec2 a_pos;
uniform vec2 u_center;
uniform vec2 u_resolution;
uniform float u_size;
uniform float u_rotation;
uniform float u_pointSize;
varying vec2 v_world;
void main() {
  float c = cos(u_rotation);
  float s = sin(u_rotation);
  vec2 p = vec2(a_pos.x * c - a_pos.y * s, a_pos.x * s + a_pos.y * c) * u_size + u_center;
  v_world = p;
  vec2 clip = (p / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = u_pointSize;
}`

const FRAGMENT = `
precision mediump float;
uniform vec4 u_color;
uniform float u_beamY;
uniform float u_beamWidth;
uniform float u_beamBoost;
uniform float u_glowBoost;
uniform vec2 u_lens;
uniform float u_lensActive;
varying vec2 v_world;
void main() {
  float beam = u_beamY < 0.0 ? 0.0 : 1.0 - smoothstep(0.0, u_beamWidth, abs(v_world.y - u_beamY));
  float insideLens = 1.0 - smoothstep(80.0, 92.0, distance(v_world, u_lens));
  if (u_lensActive > 0.5 && insideLens < 0.01) discard;
  float glow = 1.0 + u_glowBoost + beam * u_beamBoost * 1.8 + insideLens * u_lensActive * 0.6;
  float alpha = u_color.a * clamp(1.0 + beam * u_beamBoost * 0.5 + insideLens * u_lensActive * 0.2, 0.0, 1.0);
  gl_FragColor = vec4(u_color.rgb * glow, alpha);
}`

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function lineVertices(geo: WireGeometry): Float32Array {
  const out = new Float32Array(geo.edges.length * 2)
  for (let i = 0; i < geo.edges.length; i++) {
    const index = geo.edges[i] * 2
    out[i * 2] = geo.points[index]
    out[i * 2 + 1] = geo.points[index + 1]
  }
  return out
}

/** Small raw-WebGL renderer: no Three.js dependency, lazily imported by the engine. */
export function createWebGLWireframe(canvas: HTMLCanvasElement): WebGLWireframe | null {
  const gl = (canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false }) ||
    canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })) as WebGLRenderingContext | null
  if (!gl) return null

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  if (!vertex || !fragment) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  const loc = {
    pos: gl.getAttribLocation(program, 'a_pos'),
    center: gl.getUniformLocation(program, 'u_center'),
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    size: gl.getUniformLocation(program, 'u_size'),
    rotation: gl.getUniformLocation(program, 'u_rotation'),
    pointSize: gl.getUniformLocation(program, 'u_pointSize'),
    color: gl.getUniformLocation(program, 'u_color'),
    beamY: gl.getUniformLocation(program, 'u_beamY'),
    beamWidth: gl.getUniformLocation(program, 'u_beamWidth'),
    beamBoost: gl.getUniformLocation(program, 'u_beamBoost'),
    glowBoost: gl.getUniformLocation(program, 'u_glowBoost'),
    lens: gl.getUniformLocation(program, 'u_lens'),
    lensActive: gl.getUniformLocation(program, 'u_lensActive'),
  }

  const build = (data: Float32Array) => {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    return buffer
  }
  const buffers = {
    sparseLines: build(lineVertices(sparseGeo)),
    sparsePoints: build(sparseGeo.points),
    denseLines: build(lineVertices(denseGeo)),
    densePoints: build(denseGeo.points),
  }

  let width = 1
  let height = 1
  let dpr = 1
  let lost = false
  const onLost = (event: Event) => { event.preventDefault(); lost = true }
  const onRestored = () => { lost = false }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)

  const draw = (
    buffer: WebGLBuffer | null,
    mode: number,
    count: number,
    options: WireRenderOptions,
    color: number[],
    alphaScale: number,
    pointSize: number,
    lensActive: number,
  ) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(loc.pos)
    gl.vertexAttribPointer(loc.pos, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(loc.center, options.x, options.y)
    gl.uniform2f(loc.resolution, width, height)
    gl.uniform1f(loc.size, options.size)
    gl.uniform1f(loc.rotation, options.rotation)
    gl.uniform1f(loc.pointSize, pointSize * dpr)
    gl.uniform4f(loc.color, color[0], color[1], color[2], alphaScale * options.alpha)
    gl.uniform1f(loc.beamY, options.beamY)
    gl.uniform1f(loc.beamWidth, options.beamWidth)
    gl.uniform1f(loc.beamBoost, options.beamBrighten)
    gl.uniform1f(loc.glowBoost, options.glowAlpha)
    gl.uniform2f(loc.lens, options.pointer.x, options.pointer.y)
    gl.uniform1f(loc.lensActive, lensActive)
    gl.drawArrays(mode, 0, count)
  }

  return {
    resize(nextWidth, nextHeight, nextDpr) {
      width = nextWidth
      height = nextHeight
      dpr = nextDpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    },
    render(options) {
      if (lost || options.alpha <= 0) return
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
      draw(buffers.sparseLines, gl.LINES, sparseGeo.edges.length, options, [0.42, 0.84, 1], options.strokeAlpha, 1.4, 0)
      draw(buffers.sparsePoints, gl.POINTS, sparseGeo.points.length / 2, options, [0.78, 0.93, 1], options.pointAlpha, 2.6, 0)
      if (options.pointer.active) {
        draw(buffers.denseLines, gl.LINES, denseGeo.edges.length, options, [0.55, 0.9, 1], options.strokeAlpha, 1.4, 1)
        draw(buffers.densePoints, gl.POINTS, denseGeo.points.length / 2, options, [0.85, 0.96, 1], options.pointAlpha, 2.6, 1)
      }
    },
    destroy() {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      Object.values(buffers).forEach((buffer) => gl.deleteBuffer(buffer))
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    },
  }
}
