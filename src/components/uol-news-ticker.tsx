'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface UOLNewsItem {
    title: string
    link: string
    pubDate: string
}

export function UOLNewsTicker() {
    const [news, setNews] = useState<UOLNewsItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNews = async () => {
            const response = await fetch('/api/uol-news')
            const data = await response.json()
            
            const today = new Date().toLocaleDateString('pt-BR')
            const todayNews = data.filter((item: UOLNewsItem) => {
                const itemDate = new Date(item.pubDate).toLocaleDateString('pt-BR')
                return itemDate === today
            })

            setNews(todayNews)
            setLoading(false)
        }

        fetchNews()
        const interval = setInterval(fetchNews, 300000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (news.length === 0) return
        
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % news.length)
        }, 8000)
        
        return () => clearInterval(interval)
    }, [news.length])

    if (loading) {
        return (
            <Card className="p-2">
                <div className="h-6 animate-pulse bg-muted" />
            </Card>
        )
    }

    if (news.length === 0) {
        return (
            <Card className="p-2">
                <div className="text-center text-muted-foreground">Sem notícias no momento</div>
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