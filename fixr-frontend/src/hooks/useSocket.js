import { useEffect, useRef, useCallback } from 'react'
import { getSocket } from '../utils/socket'

/**
 * Manages a Socket.IO connection and event listener lifecycle.
 */
export function useSocket(event, handler) {
  const handlerRef = useRef(handler)
  useEffect(() => { handlerRef.current = handler }, [handler])

  useEffect(() => {
    const socket = getSocket()
    const listener = (...args) => handlerRef.current?.(...args)
    socket.on(event, listener)
    return () => { socket.off(event, listener) }
  }, [event])

  const emit = useCallback((emitEvent, ...args) => {
    getSocket().emit(emitEvent, ...args)
  }, [])

  return { emit }
}
