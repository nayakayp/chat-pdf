'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    if (!isProcessing) {
      inputRef.current?.focus()
    }
  }, [messages, isProcessing])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)

    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')

    const response = await axios.post('/api/send',
      {
        input,
        ns: localStorage.getItem("projectName")?.trim() as string
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    setMessages(prev => [...prev, { role: 'assistant', content: response.data }])
    setIsProcessing(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the PDF..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

