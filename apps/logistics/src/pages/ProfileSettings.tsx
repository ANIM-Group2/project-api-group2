import { useState } from 'react'
import { useAppDispatch, useAuth } from '@/store/hooks'
import { updateUser, logout } from '@/store/authSlice'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { User, Shield, LogOut, Save, Loader2, CheckCircle2 } from 'lucide-react'

export default function ProfileSettings() {
  const dispatch   = useAppDispatch()
  const { user }   = useAuth()

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName,  setLastName]  = useState(user?.lastName  ?? '')
  const [saved,     setSaved]     = useState(false)
  const [saving,    setSaving]    = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError,   setPwError]   = useState<string | null>(null)
  const [pwSaved,   setPwSaved]   = useState(false)

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()

  async function handleSaveProfile() {
    setSaving(true)
    // Optimistic update — in a real app this would call PATCH /api/users/:id
    await new Promise(r => setTimeout(r, 600))
    dispatch(updateUser({ firstName, lastName }))
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleChangePassword() {
    setPwError(null)
    if (!currentPw) { setPwError('Enter your current password'); return }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters'); return }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
    setSaving(true)
    // Simulated — would call PATCH /api/users/:id/password
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setPwSaved(true)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setTimeout(() => setPwSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{firstName} {lastName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="capitalize text-xs">{user?.role}</Badge>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display name</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email ?? ''} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={user?.role ?? ''} disabled className="opacity-60 capitalize" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
                {saved && (
                  <span className="flex items-center gap-1 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> Saved!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pwError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{pwError}</div>
              )}
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleChangePassword} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                  Update Password
                </Button>
                {pwSaved && (
                  <span className="flex items-center gap-1 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> Password updated!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400">Sign Out</CardTitle>
              <CardDescription>Sign out of your account on this device</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => dispatch(logout())}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}