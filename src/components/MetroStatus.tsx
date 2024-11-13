'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import * as XLSX from 'xlsx'

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

  const exportToExcel = () => {
    if (!status) return

    const exportData = status.lines.map(line => ({
      'Número da Linha': line.number,
      'Nome da Linha': line.name,
      'Status': line.statusDescription,
      'Motivo': line.reason || 'N/A',
      'Data de Atualização': new Date(status.updatedAt).toLocaleString('pt-BR')
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Status do Metrô')
    
    // Generate file name with current date
    const fileName = `status-metro.xlsx`
    
    // Save the file
    XLSX.writeFile(workbook, fileName)
  }

  if (loading) {
    return <Skeleton className="w-full h-[400px] rounded-lg" />
  }

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {status?.updatedAt && (
            <span className="text-sm text-muted-foreground">
              Atualizado em: {new Date(status.updatedAt).toLocaleString('pt-BR')}
            </span>
          )}
          <Button onClick={exportToExcel} className='ml-20'>
            Exportar XLSX
          </Button>
        </div>
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
