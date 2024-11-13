"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NewsScraper from "@/components/NewsScraper"
import NewsLinkSummarizer from "@/components/NewsLinkSummarizer"
import NewsTitleRewriter from "@/components/NewsTitleRewriter"
import XEmbed from "@/components/XEmbed"
import InstagramEmbed from "@/components/InstagramEmbed"
import { NewsTicker } from '@/components/news-ticker'
import Reminders from "@/components/Reminders"
import { Calendar } from "@/components/ui/calendar"
import { OpenWeatherDashboard } from '@/components/OpenWeatherDashboard'
import { MetroStatus } from '@/components/MetroStatus'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Page() {
  const { setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
          <h1
            className="font-bold text-xl cursor-pointer"
            onClick={() => window.open('/mario/index.html', '_blank')}
          >
            Dashboard
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>G1</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsTicker source="g1" />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Folha</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsTicker source="folha" />
            </CardContent>
          </Card>

          <Card className="sm:col-span-3 row-span-2">
            <CardHeader>
              <CardTitle>Clima</CardTitle>
            </CardHeader>
            <CardContent>
              <OpenWeatherDashboard />
            </CardContent>
          </Card>

          <Card className="row-span-2">
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar mode="single" className="rounded-md" />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 row-span-2">
            <CardHeader>
              <CardTitle>Lembretes</CardTitle>
            </CardHeader>
            <CardContent>
              <Reminders />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 row-span-2">
            <CardHeader>
              <CardTitle>Status do Metrô</CardTitle>
            </CardHeader>
            <CardContent>
              <MetroStatus />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Resumo de Links</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsLinkSummarizer />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Reescrever Títulos</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsTitleRewriter />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Twitter Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <XEmbed />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Instagram Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <InstagramEmbed />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle>Notícias em Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsScraper />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
