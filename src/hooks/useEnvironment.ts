import { useEffect, useState } from 'react'

export function isWeakDevice() {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  const reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches
  return cores <= 4 || memory <= 4 || reducedData
}

export function useEnvironment() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [weak, setWeak] = useState(isWeakDevice)
  const [finePointer, setFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const data = window.matchMedia('(prefers-reduced-data: reduce)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      setFinePointer(pointer.matches)
      setWeak(isWeakDevice() || data.matches)
      setPrefersReducedMotion(motion.matches)
    }
    onChange()
    pointer.addEventListener('change', onChange)
    data.addEventListener('change', onChange)
    motion.addEventListener('change', onChange)
    return () => {
      pointer.removeEventListener('change', onChange)
      data.removeEventListener('change', onChange)
      motion.removeEventListener('change', onChange)
    }
  }, [])

  const [userReduced, setUserReduced] = useState(false)
  // The footer toggle is the user's master switch; `weak` only selects a lighter renderer.
  const reduced = prefersReducedMotion || userReduced

  return { reduced, systemReduced: prefersReducedMotion, userReduced, setUserReduced, weak, finePointer }
}

export type Environment = ReturnType<typeof useEnvironment>
