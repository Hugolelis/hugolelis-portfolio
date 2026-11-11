import { useEffect, useState } from 'react'
import type { ActivityDay } from '../components/sections/ActivityHeatmap'

interface State {
  days: ActivityDay[]
  loading: boolean
  error: boolean
}

// github's own API doesn't expose the contributions calendar; this public,
// unauthenticated endpoint reads it from the profile page instead.
const API = (username: string) =>
  `https://github-contributions-api.jogruber.de/v4/${username}?y=last`

export function useGithubContributions(username: string) {
  const [state, setState] = useState<State>({ days: [], loading: true, error: false })

  useEffect(() => {
    let cancelled = false
    fetch(API(username))
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.json()
      })
      .then((data: { contributions: { date: string; count: number }[] }) => {
        if (cancelled) return
        const days = data.contributions.map(({ date, count }) => ({ date, count }))
        setState({ days, loading: false, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ days: [], loading: false, error: true })
      })

    return () => {
      cancelled = true
    }
  }, [username])

  return state
}
