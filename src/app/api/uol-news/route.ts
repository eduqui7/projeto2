import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

export async function GET() {
  try {
    const parser = new Parser()
    const feed = await parser.parseURL('http://rss.uol.com.br/feed/noticias.xml')
    
    if (!feed.items || !Array.isArray(feed.items)) {
      return NextResponse.json([])
    }

    const news = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    }))

    return NextResponse.json(news)
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json([])
  }
}
