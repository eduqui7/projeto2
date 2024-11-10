'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExternalLink } from 'lucide-react'

interface NewsItem {
  title: string
  link: string
  pubDate: string
}

interface NewsTickerProps {
  source: 'folha' | 'g1'
}

export function NewsTicker({ source }: NewsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const endpoint = source === 'folha' ? '/api/folha-news' : '/api/g1-politics'
        console.log('Fetching from endpoint:', endpoint)
        const response = await fetch(endpoint)
        const data = await response.json()
        console.log('Received data in news-ticker:', data)

        const today = new Date().toLocaleDateString('pt-BR')
        const todayNews = data.filter((item: NewsItem) => {
          const itemDate = new Date(item.pubDate).toLocaleDateString('pt-BR')
          return itemDate === today
        })
        console.log('Filtered today news:', todayNews)

        // Remove duplicate news by title
        const uniqueNews = todayNews.filter((item: { title: any }, index: any, self: any[]) =>
          index === self.findIndex((t) => t.title === item.title)
        )

        setNews(todayNews)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchNews()
    const fetchInterval = setInterval(fetchNews, 300000) // 5 minutes

    return () => clearInterval(fetchInterval)
  }, [source])

  useEffect(() => {
    if (news.length === 0) return

    const rotationInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 8000)

    return () => clearInterval(rotationInterval)
  }, [news.length])

  if (loading) {
    return (
      <Card className="p-2 h-[100px]">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    )
  }

  if (news.length === 0) {
    return (
      <Card className="p-2 h-[100px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Sem notícias no momento</p>
      </Card>
    )
  }

  const currentNews = news[currentIndex]

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="p-2 h-[100px] transition-all hover:shadow-md">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center justify-between">
              <Image
                src={source === 'g1' ? "/logos/g1svg.svg" : "/logos/folha-logo.svg"}
                alt={`${source.toUpperCase()} Logo`}
                width={24}
                height={24}
                className="dark:invert"
              />
              <Badge variant="secondary" className="text-xs">
                {new Date(currentNews.pubDate).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <a
              href={currentNews.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2"
            >
              <h3 className="font-medium group-hover:text-primary transition-colors flex-1 break-words line-clamp-2">
                {currentNews.title}
              </h3>
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {news.map((item, index) => (
              <a
                key={item.link}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-2 rounded-lg transition-colors hover:bg-accent ${index === currentIndex ? 'bg-accent' : ''
                  }`}
              >
                <p className="text-sm text-muted-foreground mb-1">
                  {new Date(item.pubDate).toLocaleTimeString('pt-BR')}
                </p>
                <p className="text-sm font-medium">{item.title}</p>
              </a>
            ))}
          </div>
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  )
}