"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { WeatherDashboard } from "@/components/WeatherDashboard"
import NewsScraper from "@/components/NewsScraper"
import NewsLinkSummarizer from "@/components/NewsLinkSummarizer"
import NewsTitleRewriter from "@/components/NewsTitleRewriter"
import XEmbed from "@/components/XEmbed"
import InstagramEmbed from "@/components/InstagramEmbed"
import { NewsTicker } from '@/components/news-ticker'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Page() {
  const { setTheme } = useTheme()
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex flex-col border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="px-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Selecione o tema:</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NewsTicker source="g1" />
              <NewsTicker source="folha" />
            </div>

            <section className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-[300px] md:h-[465px] overflow-auto">
              <WeatherDashboard />
            </section>

            <section className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-[300px] md:h-[400px] overflow-auto">
              <NewsScraper />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-[300px] md:h-[400px] overflow-auto">
                <NewsLinkSummarizer />
              </section>
              <section className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-[300px] md:h-[400px] overflow-auto">
                <NewsTitleRewriter />
              </section>
              <section className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-[300px] md:h-[400px] overflow-auto">
                <XEmbed />
              </section>
              <section className="rounded-lg border bg-card text-card-foreground shadow-sm min-h-[300px] md:h-[400px] overflow-auto">
                <InstagramEmbed />
              </section>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}