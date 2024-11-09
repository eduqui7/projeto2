'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NewsItem {
  title: string
  link: string
  pubDate: string
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/g1-politics')
        const data = await response.json()

        // Filter for today's news
        const today = new Date().toLocaleDateString('pt-BR')
        const todayNews = data.filter((item: NewsItem) =>
          new Date(item.pubDate).toLocaleDateString('pt-BR') === today
        )

        setNews(todayNews)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching news:', error)
        setLoading(false)
      }
    }

    fetchNews()
    const fetchInterval = setInterval(fetchNews, 300000)

    return () => clearInterval(fetchInterval)
  }, [])

  useEffect(() => {
    if (news.length > 0) {
      const rotationInterval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length)
      }, 8000) // Rotate every 5 seconds

      return () => clearInterval(rotationInterval)
    }
  }, [news])

  if (loading || news.length === 0) {
    return (
      <Card className="p-2">
        <div className="h-6 animate-pulse bg-muted" />
      </Card>
    )
  }

  const currentNews = news[currentIndex]

  return (
    <Card className="p-2">
      <a
        href={currentNews.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between"
      >
        <h3 className="font-medium group-hover:text-primary transition-colors truncate">
          {currentNews.title}
        </h3>
        <Badge variant="outline" className="ml-2 shrink-0">
          {new Date(currentNews.pubDate).toLocaleDateString('pt-BR')}
        </Badge>
      </a>
    </Card>
  )
}
