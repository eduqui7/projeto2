"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

interface Reminder {
  id: number
  text: string
  timestamp: string
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminder, setNewReminder] = useState("")

  const addReminder = () => {
    if (newReminder.trim()) {
      const reminder: Reminder = {
        id: Date.now(),
        text: newReminder,
        timestamp: new Date().toLocaleString()
      }
      setReminders([...reminders, reminder])
      setNewReminder("")
    }
  }

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id))
  }

  return (
    <Card className="h-full border-0">
      <CardHeader>
        <CardTitle>Meus Lembretes durante o PGM</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Adicionar novo lembrete..."
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addReminder()}
          />
          <Button onClick={addReminder}>Adicionar</Button>
        </div>
        <ScrollArea className="h-[280px]">
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <p>{reminder.text}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.timestamp}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
