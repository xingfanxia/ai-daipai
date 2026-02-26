import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, Palette, Download } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "上传照片",
    subtitle: "Upload Photos",
    description: "Upload your reference photos — headshot, half-body, or full-body.",
  },
  {
    icon: Palette,
    title: "自定义风格",
    subtitle: "Customize Style",
    description: "Choose scenes, styles, outfits, and moods — or use quick presets.",
  },
  {
    icon: Sparkles,
    title: "AI 生成",
    subtitle: "AI Generate",
    description: "Our AI creates stunning professional photos in your chosen style.",
  },
  {
    icon: Download,
    title: "下载作品",
    subtitle: "Download Results",
    description: "Download your beautiful AI-generated photos instantly.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center">
      {/* Hero */}
      <section className="flex w-full flex-1 flex-col items-center justify-center gap-8 px-4 py-20 text-center sm:py-32">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            AI代拍
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground sm:text-xl">
            Transform your photos into stunning professional shots with AI
          </p>
        </div>
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href="/create">Start Creating</Link>
        </Button>
      </section>

      {/* Features */}
      <section className="w-full border-t bg-muted/40 px-4 py-16 sm:py-24">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {feature.subtitle}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
