import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Generic data-fetching hook.
 * @param {Function} apiFn  – async function that returns { data }
 * @param {Array}    deps   – re-fetch when these change
 * @param {Object}   opts   – { immediate: bool, defaultData }
 */
export function useApi(apiFn, deps = [], opts = {}) {
  const { immediate = true, defaultData = null } = opts
  const [data, setData]       = useState(defaultData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError]     = useState(null)
  const mountedRef             = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      if (mountedRef.current) setData(res.data)
      return res.data
    } catch (err) {
      if (mountedRef.current) setError(err?.response?.data?.message || err.message || 'Request failed')
      throw err
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute()
  }, [execute]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: execute, setData }
}

export default useApi
