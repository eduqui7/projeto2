'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const XEmbed = () => {
    const [postUrl, setPostUrl] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [tweetId, setTweetId] = useState('')

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.setAttribute('data-dnt', 'true')
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const extractTweetId = (url: string) => {
        const matches = url.match(/status\/(\d+)/)
        return matches ? matches[1] : null
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleEmbed = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (inputValue.includes('twitter.com') || inputValue.includes('x.com')) {
            const id = extractTweetId(inputValue)
            if (id) {
                setTweetId(id)
                setPostUrl(inputValue)
            }
        }
    }

    const saveAsHtml = () => {
        if (!tweetId) return

        const htmlContent = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Card</title>
        </head>
        <body>
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    overflow: hidden;
                }
                .card {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100vh;
                    border-radius: 3px;
                    padding: 0%;
                    margin-bottom: 20px;
                }
                iframe {
                    border: none;
                    height: 100vh;
                    margin-top: 30px;
                }
            </style>
            <div class="card">
                <iframe
                    src="https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true"
                    width="550"
                    height="550"
                    frameborder="0"
                    scrolling="no">
                </iframe>
            </div>
        </body>
        </html>`

        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'x-embed.html'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="container flex flex-col items-center justify-center gap-2">
            <div className="w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Card <span className="text-primary">X/Twitter</span>
                    </CardTitle>
                    <CardDescription>
                        Cole o URL do post para gerar um card incorporável
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4">
                        <Input
                            type="url"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="https://..."
                            className="w-full"
                            required
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={handleEmbed}
                                className="w-full"
                            >
                                Gerar
                            </Button>
                            {tweetId && (
                                <Button 
                                    onClick={saveAsHtml}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Salvar HTML
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </div>

            {tweetId && (
                <div className="w-full">
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <iframe
                            src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true`}
                            width="550"
                            height="680"
                            frameBorder="0"
                            scrolling="no"
                        />
                    </CardContent>
                </div>
            )}
        </div>
    )
}

export default XEmbed
