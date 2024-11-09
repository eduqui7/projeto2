'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

    const handleEmbed = () => {
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
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Card Instagram</h2>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="instagram-url">Cole o URL do post</Label>
                    <Input
                        id="instagram-url"
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
                    {postUrl && (
                        <Button 
                            onClick={saveAsHtml}
                            variant="secondary"
                        >
                            Salvar HTML
                        </Button>
                    )}
                </div>
                {postUrl && (
                    <div className="mt-6 flex justify-center">
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default InstagramEmbed
