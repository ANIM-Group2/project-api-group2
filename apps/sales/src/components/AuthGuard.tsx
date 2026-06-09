import type { ReactNode } from 'react'

const APP_ROLE  = 'sales'
const LOGIN_URL = 'http://localhost:3000'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('aeronexis_token')
  const role  = localStorage.getItem('aeronexis_role')

  if (!token || role !== APP_ROLE) {
    window.location.href = LOGIN_URL
    return null
  }

  return <>{children}</>
}