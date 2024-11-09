'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

    const handleEmbed = () => {
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
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Card X/Twitter</h2>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="tweet-url">Cole o URL do post</Label>
                    <Input
                        id="tweet-url"
                        type="text"
                        placeholder="https://"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex space-x-2">
                    <Button 
                        onClick={handleEmbed}
                        variant="default"
                    >
                        Gerar
                    </Button>
                    {tweetId && (
                        <Button 
                            onClick={saveAsHtml}
                            variant="secondary"
                        >
                            Salvar HTML
                        </Button>
                    )}
                </div>
                {tweetId && (
                    <div className="mt-6 flex justify-center">
                        <iframe
                            src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true`}
                            width="300px"
                            height="680px"
                            frameBorder="0"
                            scrolling="no"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default XEmbed
