import { useEffect, useState } from 'react'

const NoSSR = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return fallback
  }

  return children
}

export { NoSSR }
