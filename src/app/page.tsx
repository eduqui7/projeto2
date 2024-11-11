'use client';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Hero12 = () => {
  return (
    <section className="flex justify-center min-h-screen relative">
      <div className="container relative">
        <div className="flex flex-col items-center justify-center gap-8 px-4">
          <div className="animate-fade-up space-y-8 text-center">

            <DotLottieReact
              src="https://lottie.host/65d696a5-fb77-4d0c-9070-b03d67b37a02/m7syyDbGeu.lottie"
              loop
              autoplay
              className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] mx-auto"
            />

            <Badge variant="secondary" className="animate-fade-in">
              <Sparkles className="mr-2 h-3 w-3" />
              v1.0.0
            </Badge>

            <h1 className="text-3xl font-bold antialiased tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
              Dashboard TVT
            </h1>

            <p className="text-muted-foreground antialiased mx-auto max-w-[600px] text-sm sm:text-xl leading-relaxed">
              Bem-vindo ao dashboard para geração de conteúdo!
              Aqui você encontrará algumas as ferramentas para controlar
              as interações em tempo real, garantindo transmissões mais
              ágeis e informativos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="group transition-all">
                  Acessar o Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Button variant="secondary" size="lg" className="group">
                Saiba mais
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
            </div>

            <div className="animate-fade-in opacity-60">
              <p className="text-sm text-muted-foreground">
                Desenvolvido com ❤️ e ☕ por <b>Eduardo Quirino</b> 😊
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero12;