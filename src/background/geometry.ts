export interface WireGeometry {
  points: Float32Array
  edges: Uint16Array
}

type Chain = { points: number[]; edges: number[] }

function chain(out: Chain, count: number, fn: (t: number, i: number) => [number, number], close = false): void {
  const first = out.points.length / 2
  for (let i = 0; i < count; i++) {
    const [x, y] = fn(i / (count - 1), i)
    out.points.push(x, y)
    if (i > 0) out.edges.push(first + i - 1, first + i)
  }
  if (close) out.edges.push(first + count - 1, first)
}

/** Code-generated skull/tooth wireframe; no patient imagery. */
export function makeWireGeometry(dense: boolean): WireGeometry {
  const c: Chain = { points: [], edges: [] }
  const outer = dense ? 64 : 36
  const eye = dense ? 20 : 12

  chain(c, outer, (t) => {
    const a = t * Math.PI * 2
    const y = Math.sin(a) * 0.86 + 0.06
    const jaw = y > 0.5 ? 0.82 : 1
    return [Math.cos(a) * 0.72 * jaw, y]
  }, true)

  chain(c, dense ? 30 : 16, (t) => {
    const a = Math.PI * (0.08 + t * 0.84)
    return [Math.cos(a) * 0.58, 0.42 + Math.sin(a) * 0.42]
  })

  for (const side of [-1, 1]) {
    chain(c, eye, (t) => {
      const a = t * Math.PI * 2
      return [side * 0.3 + Math.cos(a) * 0.17, -0.08 + Math.sin(a) * 0.21]
    }, true)
  }

  chain(c, 5, (t) => [Math.sin(t * Math.PI * 2) * 0.09, 0.04 + t * 0.34])

  chain(c, dense ? 22 : 12, (t) => {
    const a = Math.PI * (0.12 + t * 0.76)
    return [Math.cos(a) * 0.5, 0.62 + Math.sin(a) * 0.1]
  })

  if (dense) {
    const outerCount = 64
    for (let i = 0; i < outerCount; i += 4) {
      const a = (i / outerCount) * Math.PI * 2
      const inner = c.points.length / 2
      c.points.push(Math.cos(a) * 0.52, Math.sin(a) * 0.62 + 0.06)
      c.edges.push(i, inner)
    }
  }

  return { points: new Float32Array(c.points), edges: new Uint16Array(c.edges) }
}
