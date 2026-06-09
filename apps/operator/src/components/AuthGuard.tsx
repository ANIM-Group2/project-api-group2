import type { ReactNode } from 'react'

const APP_ROLE  = 'operator'
const LOGIN_URL = 'http://localhost:3000'

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('aeronexis_token')
  const role  = localStorage.getItem('aeronexis_role')

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('aeronexis_token')
    localStorage.removeItem('aeronexis_role')
    localStorage.removeItem('aeronexis_user')
    window.location.href = LOGIN_URL
    return null
  }

  if (role !== APP_ROLE) {
    window.location.href = '/403'
    return null
  }

  return <>{children}</>
}