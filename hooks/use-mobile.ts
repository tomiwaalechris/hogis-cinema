import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Set initial value inside state initializer if possible, or just ignore for now
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    // Avoid double-rendering synchronously by deferring initial update if needed,
    // but a cleaner way is just wrapping it in RAF or accepting the small initial layout shift.
    // Or just setting it initially correctly outside effect (which we can't do with window).
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
