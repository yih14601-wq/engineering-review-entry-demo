import { useCallback, useEffect, useRef, useState } from 'react'

export function useAnchorNavigation(anchorIds: string[], defaultAnchor: string) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [activeAnchor, setActiveAnchor] = useState(defaultAnchor)
  const lockRef = useRef<string | null>(null)
  const unlockTimerRef = useRef<number | null>(null)

  const registerSection = useCallback(
    (id: string) => (node: HTMLElement | null) => {
      sectionRefs.current[id] = node
    },
    [],
  )

  const scrollToAnchor = useCallback((id: string) => {
    const container = scrollRef.current
    const section = sectionRefs.current[id]
    if (!container || !section) return

    lockRef.current = id
    setActiveAnchor(id)
    const containerTop = container.getBoundingClientRect().top
    const targetTop = section.getBoundingClientRect().top - containerTop + container.scrollTop - 24
    container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })

    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current)
    unlockTimerRef.current = window.setTimeout(() => {
      lockRef.current = null
      unlockTimerRef.current = null
    }, 700)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const updateActiveAnchor = () => {
      if (lockRef.current) return
      const containerTop = container.getBoundingClientRect().top
      let current = anchorIds[0] ?? defaultAnchor

      anchorIds.forEach((id) => {
        const section = sectionRefs.current[id]
        if (section && section.getBoundingClientRect().top - containerTop <= 96) {
          current = id
        }
      })

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 24) {
        current = anchorIds[anchorIds.length - 1] ?? current
      }
      setActiveAnchor((previous) => (previous === current ? previous : current))
    }

    updateActiveAnchor()
    container.addEventListener('scroll', updateActiveAnchor, { passive: true })
    window.addEventListener('resize', updateActiveAnchor)
    return () => {
      container.removeEventListener('scroll', updateActiveAnchor)
      window.removeEventListener('resize', updateActiveAnchor)
    }
  }, [anchorIds, defaultAnchor])

  useEffect(() => () => {
    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current)
  }, [])

  return {
    activeAnchor,
    registerSection,
    scrollRef,
    scrollToAnchor,
  }
}
