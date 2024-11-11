'use client'

import { Player } from '@lottiefiles/react-lottie-player'

export default function LottiePlayer() {
  return (
    <Player
      autoplay
      loop
      src="/logos/logoAniv2white.json"
      style={{ width: '100%', maxWidth: '500px' }}
    />
  )
}
