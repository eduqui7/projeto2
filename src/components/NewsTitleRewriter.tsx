'use client'

import { useState } from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function NewsTitleRewriter() {
  const [originalTitle, setOriginalTitle] = useState<string>('')
  const [newTitle, setNewTitle] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!originalTitle?.toString().trim()) {
      setNewTitle('Por favor insira um título ou subtítulo')
      return
    }
    setLoading(true)

    try {
      const response = await fetch('/api/rewrite-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalTitle: originalTitle.toString() }),
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setNewTitle(data.newTitle)
    } catch (error) {
      console.error('Erro ao reescrever título:', error)
      setNewTitle('Falha ao gerar novo título. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-2">
      <div className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Título <span className="text-primary">AI</span>
          </CardTitle>
          <CardDescription>
            Cole um título ou subtítulo para reescrever de forma inteligente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              value={originalTitle}
              onChange={(e) => setOriginalTitle(e.target.value)}
              placeholder="Cole aqui..."
              className="w-full"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Reescrevendo...' : 'Reescrever'}
            </Button>
          </form>
        </CardContent>
      </div>

      {newTitle && (
        <div className="w-full">
          <CardHeader>
            <CardTitle>Novo Título</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{newTitle}</p>
          </CardContent>
        </div>
      )}
    </div>
  )
}
