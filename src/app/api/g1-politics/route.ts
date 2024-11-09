import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()
const G1_POLITICS_RSS = 'https://g1.globo.com/rss/g1/politica'

export async function GET() {
  try {
    const feed = await parser.parseURL(G1_POLITICS_RSS)
    const news = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
    }))

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
