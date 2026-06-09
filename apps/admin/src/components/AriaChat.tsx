import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Send, Loader2, Bot, User, History, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { saveSession } from '@/pages/AriaHistory'

const AGENT_URL = 'http://localhost:4000/api/agent/chat'

interface Message {
  role: 'user' | 'aria'
  text: string
  time: string
}

function welcomeMessage(): Message {
  return {
    role: 'aria',
    text: "Hello Philippe! I'm ARIA, your AERONEXIS intelligence assistant. Ask me anything about production, inventory, or orders.",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

export function AriaChat() {
  const navigate  = useNavigate()
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleClose() {
    saveSession(messages)
    setOpen(false)
  }

  function handleNewChat() {
    saveSession(messages)
    setMessages([welcomeMessage()])
    setInput('')
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const token = localStorage.getItem('aeronexis_token') || ''
    const time  = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setMessages(prev => [...prev, { role: 'user', text, time }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(AGENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      })

      if (res.status === 401) {
        localStorage.removeItem('aeronexis_token')
        localStorage.removeItem('aeronexis_role')
        localStorage.removeItem('aeronexis_user')
        window.location.href = 'http://localhost:3000'
        return
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMessages(prev => [...prev, {
          role: 'aria',
          text: `Error ${res.status}: ${err.error || err.detail || 'Something went wrong.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
        return
      }

      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'aria',
        text: data.reply || 'No response.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'aria',
        text: 'Unable to reach ARIA. Make sure the agent server and API gateway are running.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => open ? handleClose() : setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all',
          'bg-primary text-primary-foreground hover:opacity-90'
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-96 flex-col rounded-xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-xl border-b border-border bg-primary/10 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">ARIA</p>
              <p className="text-xs text-muted-foreground">Aeronexis Intelligence Assistant</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" title="New chat" onClick={handleNewChat}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="View history"
                onClick={() => { handleClose(); navigate('/aria-history') }}>
                <History className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="ml-1 flex h-2 w-2 rounded-full bg-green-400" />
          </div>

          {/* Messages */}
          <div className="flex h-96 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                <div className={cn(
                  'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs',
                  msg.role === 'aria' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  {msg.role === 'aria' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={cn(
                  'max-w-[75%] rounded-xl px-3 py-2 text-sm',
                  msg.role === 'aria' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
                )}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <p className={cn('mt-1 text-xs', msg.role === 'aria' ? 'text-muted-foreground' : 'text-primary-foreground/70')}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-muted px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">ARIA is thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
              placeholder="Ask ARIA anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={loading}
            />
            <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}