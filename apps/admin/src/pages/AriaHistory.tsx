import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, User, Trash2, MessageCirclePlus, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'aria'
  text: string
  time: string
}

interface ChatSession {
  id: string
  startedAt: string
  messages: ChatMessage[]
}

const STORAGE_KEY = 'aeronexis_aria_history'

export function loadHistory(): ChatSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveSession(messages: ChatMessage[]) {
  if (messages.length <= 1) return // skip sessions with only the welcome message
  const sessions = loadHistory()
  const session: ChatSession = {
    id: Date.now().toString(),
    startedAt: new Date().toISOString(),
    messages,
  }
  sessions.unshift(session)
  // Keep only last 50 sessions
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)))
}

export default function AriaHistory() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    setSessions(loadHistory())
  }, [])

  function deleteSession(id: string) {
    const updated = sessions.filter(s => s.id !== id)
    setSessions(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function clearAll() {
    setSessions([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ARIA Chat History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {sessions.length} conversation{sessions.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <div className="flex gap-2">
          {sessions.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}
              className="text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Clear all
            </Button>
          )}
          <Button size="sm" onClick={() => navigate('/overview')}>
            <MessageCirclePlus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No conversations yet.</p>
            <Button size="sm" onClick={() => navigate('/overview')}>
              Start a conversation with ARIA
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const isOpen = expanded === session.id
            const userMessages = session.messages.filter(m => m.role === 'user').length
            const preview = session.messages.find(m => m.role === 'user')?.text || ''
            const date = new Date(session.startedAt)

            return (
              <Card key={session.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer py-3 px-4 hover:bg-muted/50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : session.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{preview}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {userMessages} message{userMessages !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={e => { e.stopPropagation(); deleteSession(session.id) }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="px-4 pb-4 pt-0 border-t border-border/50">
                    <div className="space-y-3 mt-3 max-h-96 overflow-y-auto">
                      {session.messages.map((msg, i) => (
                        <div key={i} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                          <div className={cn(
                            'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs',
                            msg.role === 'aria' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          )}>
                            {msg.role === 'aria' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                          </div>
                          <div className={cn(
                            'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                            msg.role === 'aria' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
                          )}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            <p className={cn('mt-1 text-xs', msg.role === 'aria' ? 'text-muted-foreground' : 'text-primary-foreground/70')}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}