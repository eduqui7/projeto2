'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import clsx from 'clsx'

interface MetroLine {
  name: string
  number: string
  reason: string
  statusDescription: string
  status: string
}

interface MetroStatus {
  lines: MetroLine[]
  updatedAt: string
}

export function MetroStatus() {
  const [status, setStatus] = useState<MetroStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch('/api/metro/status')
      const data = await response.json()
      setStatus(data)
      setLoading(false)
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <Skeleton className="w-full h-[400px] rounded-lg" />
  }

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Status das Linhas do Metrô</h2>
        {status?.updatedAt && (
          <span className="text-sm text-muted-foreground">
            Atualizado em: {new Date(status.updatedAt).toLocaleString('pt-BR')}
          </span>
        )}
      </div>
      <ScrollArea className="h-[300px] pr-4">
        {status?.lines.map((line) => (
          <div
            key={line.number}
            className="mb-4 p-4 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">
                Linha {line.number} - {line.name}
              </h3>
              <Badge
                className={clsx(
                  'text-white border-0',
                  line.status === 'NORMAL' 
                    ? '!bg-emerald-500 hover:!bg-emerald-600' 
                    : '!bg-red-500 hover:!bg-red-600'
                )}
              >
                {line.statusDescription}
              </Badge>
            </div>
            {line.reason && (
              <p className="text-sm text-muted-foreground">{line.reason}</p>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
