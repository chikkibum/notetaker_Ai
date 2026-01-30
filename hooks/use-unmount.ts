import { useRef, useEffect } from "react"

/**
 * Hook that executes a callback when the component unmounts.
 *
 * @param callback Function to be called on component unmount
 */
export const useUnmount = (callback: (...args: Array<unknown>) => void) => {
  const ref = useRef(callback)
  // eslint-disable-next-line react-hooks/refs -- keeping callback ref current for cleanup
  ref.current = callback

  useEffect(
    () => () => {
      ref.current()
    },
    []
  )
}

export default useUnmount
