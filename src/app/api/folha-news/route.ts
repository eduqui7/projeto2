import { NextResponse } from 'next/server'
import { Parser } from 'htmlparser2'
import iconv from 'iconv-lite'

export async function GET() {
  try {
    const response = await fetch('https://feeds.folha.uol.com.br/poder/rss091.xml')
    const buffer = await response.arrayBuffer()
    const xml = iconv.decode(Buffer.from(buffer), 'iso-8859-1')
    
    const items: any[] = []
    let currentItem: any = {}
    let currentTag = ''
    let isItem = false
    let textContent = ''
    
    const parser = new Parser({
      onopentag(name) {
        currentTag = name.toLowerCase()
        if (currentTag === 'item') {
          isItem = true
          currentItem = {}
        }
        textContent = ''
      },
      ontext(text) {
        if (isItem) {
          textContent += text
        }
      },
      onclosetag(name) {
        const tag = name.toLowerCase()
        if (isItem && ['title', 'link', 'pubdate'].includes(tag)) {
          const key = tag === 'pubdate' ? 'pubDate' : tag
          currentItem[key] = textContent.trim()
        }
        if (tag === 'item' && currentItem.title && currentItem.link) {
          isItem = false
          items.push({...currentItem})
        }
      }
    }, { decodeEntities: true, xmlMode: true })
    
    parser.write(xml)
    parser.end()
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching Folha news:', error)
    return NextResponse.json([])
  }
}
