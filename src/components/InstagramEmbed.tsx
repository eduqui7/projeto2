'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

declare global {
    interface Window {
        instgrm: {
            Embeds: {
                process(): void
            }
        }
    }
}

const InstagramEmbed = () => {
    const [postUrl, setPostUrl] = useState('')
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        document.body.appendChild(script)

        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process()
            }
        }

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleEmbed = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (inputValue.includes('instagram.com')) {
            setPostUrl(inputValue)
            setTimeout(() => {
                if (window.instgrm) {
                    window.instgrm.Embeds.process()
                }
            }, 100)
        }
    }

    const saveAsHtml = () => {
        if (!postUrl) return

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
    </style>
    <div class="card">
        <blockquote class="instagram-media" data-instgrm-captioned 
        data-instgrm-permalink="${postUrl}"
        data-instgrm-version="14" style="background: #FFF; 
        border: 0; 
        border-radius: 3px;
        ">
        </blockquote>
    </div>
    <script async src="https://www.instagram.com/embed.js"></script>
</body>
</html>`

        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'instagram-embed.html'
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
                        Card <span className="text-primary">Instagram</span>
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
                            {postUrl && (
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

            {postUrl && (
                <div className="w-full">
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <blockquote
                            className="instagram-media"
                            data-instgrm-captioned
                            data-instgrm-permalink={postUrl}
                            data-instgrm-version="14"
                            style={{
                                background: '#FFF',
                                border: '0',
                                borderRadius: '3px',
                                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                                margin: '1px',
                                maxWidth: '540px',
                                minWidth: '326px',
                                padding: '0',
                                width: 'calc(100% - 2px)'
                            }}
                        />
                    </CardContent>
                </div>
            )}
        </div>
    )
}

export default InstagramEmbed
