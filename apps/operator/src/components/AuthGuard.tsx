import { useEffect, useState, type ReactNode } from 'react'
import { Loader2, Plane } from 'lucide-react'

const APP_ROLE = 'operator'
const LOGIN_URL = 'http://localhost:3000'
const API_URL = 'http://localhost:4000'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    async function verifyAuth() {
      // Step 1: Read token and role from URL params if present
      const urlParams = new URLSearchParams(window.location.search)
      const tokenFromUrl = urlParams.get('token')
      const roleFromUrl = urlParams.get('role')

      if (tokenFromUrl && roleFromUrl) {
        // Save to localStorage and clean URL
        localStorage.setItem('aeronexis_token', tokenFromUrl)
        localStorage.setItem('aeronexis_role', roleFromUrl)
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // Step 2: Read token and role from localStorage
      const token = localStorage.getItem('aeronexis_token')
      const role = localStorage.getItem('aeronexis_role')

      // Step 3: If missing or role !== 'operator' → redirect to LOGIN_URL
      if (!token || !role || role !== APP_ROLE) {
        window.location.href = LOGIN_URL
        return
      }

      // Step 4: Verify token with API
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          // Token is valid
          setIsAuthorized(true)
        } else {
          // Token is invalid → clear storage and redirect
          localStorage.clear()
          window.location.href = LOGIN_URL
          return
        }
      } catch {
        // Step 6: On fetch error → still show children (API might be down)
        setIsAuthorized(true)
      }

      setIsVerifying(false)
    }

    verifyAuth()
  }, [])

  if (isVerifying && !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Plane className="h-8 w-8" />
            <div>
              <span className="text-xl font-bold">AERONEXIS</span>
              <span className="ml-1 text-sm text-muted-foreground">DYNAMICS</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium tracking-wider">VERIFYING ACCESS...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
