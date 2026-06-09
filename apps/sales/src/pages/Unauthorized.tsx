import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

export default function Unauthorized() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
        <ShieldAlert className="h-12 w-12 text-red-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-foreground">403</h1>
        <p className="text-xl font-semibold text-foreground">Access denied</p>
        <p className="text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
        <Button onClick={() => window.location.href = 'http://localhost:3000'}>Go to login</Button>
      </div>
    </div>
  )
}