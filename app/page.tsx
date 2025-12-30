"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload, Sparkles, Zap, ImageIcon, Users, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        setGeneratedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt.trim()) return

    try {
      setIsGenerating(true)
      setError(null)
      setGeneratedImage(null)

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage,
          prompt,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Request failed with status ${res.status}`)
      }

      const data = (await res.json()) as { image?: string; error?: string }

      if (data.error || !data.image) {
        throw new Error(data.error || "No image returned from API")
      }

      setGeneratedImage(data.image)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "Failed to generate image")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🍌</div>
              <span className="text-2xl font-bold text-banana">Nano Banana</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#showcase"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Showcase
              </a>
              <a
                href="#reviews"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Reviews
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </nav>
            <Button className="bg-banana text-banana-foreground hover:bg-banana/90">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="absolute top-20 left-10 text-6xl opacity-10 rotate-12">🍌</div>
        <div className="absolute bottom-20 right-20 text-8xl opacity-10 -rotate-12">🍌</div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-banana/10 text-banana text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              The AI model that outperforms Flux Kontext
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Transform Images with <span className="text-banana">Simple Text</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Advanced AI image editing with natural language. Achieve consistent character editing and perfect scene
              preservation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-banana text-banana-foreground hover:bg-banana/90 text-lg px-8">
                Start Editing
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Upload Section */}
      <section id="editor" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Try The AI Editor</h2>
              <p className="text-lg text-muted-foreground">Experience the power of natural language image editing</p>
            </div>

            <Card className="p-8 border-2">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Upload Image</label>
                  <div className="relative border-2 border-dashed border-border rounded-lg p-8 hover:border-banana transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {uploadedImage ? (
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-banana transition-colors" />
                        <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </div>

                {/* Prompt Area */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Describe Your Edit</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Place the person on a snowy mountain with aurora in the sky..."
                    className="w-full h-32 px-4 py-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-banana"
                  />
                  <Button
                    className="w-full mt-4 bg-banana text-banana-foreground hover:bg-banana/90 disabled:opacity-60"
                    size="lg"
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !uploadedImage || !prompt.trim()}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Now"}
                  </Button>
                  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>
              </div>

              {/* Output Gallery */}
              <div className="mt-10 border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">Output Gallery</h3>
                {!generatedImage && !isGenerating && (
                  <p className="text-sm text-muted-foreground">
                    Upload an image, enter a prompt, then click &quot;Generate Now&quot; to see results here.
                  </p>
                )}
                {isGenerating && (
                  <p className="text-sm text-muted-foreground">Generating image with Gemini 2.5 Flash Image...</p>
                )}
                {generatedImage && (
                  <div className="mt-4">
                    <img
                      src={generatedImage}
                      alt="Generated by Gemini 2.5 Flash Image"
                      className="w-full max-h-[480px] object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Why Choose Nano Banana? Revolutionary AI image editing with natural language understanding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className="w-12 h-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-banana" />
              </div>
              <h3 className="text-xl font-bold mb-2">Natural Language Editing</h3>
              <p className="text-muted-foreground">
                Edit images using simple text prompts. Our AI understands complex instructions like GPT for images
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className="w-12 h-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-banana" />
              </div>
              <h3 className="text-xl font-bold mb-2">Character Consistency</h3>
              <p className="text-muted-foreground">
                Maintain perfect character details across edits. Excels at preserving faces and identities
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className="w-12 h-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-banana" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scene Preservation</h3>
              <p className="text-muted-foreground">
                Seamlessly blend edits with original backgrounds. Superior scene fusion compared to competitors
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className="w-12 h-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-banana" />
              </div>
              <h3 className="text-xl font-bold mb-2">One-Shot Editing</h3>
              <p className="text-muted-foreground">
                Perfect results in a single attempt. Solves one-shot image editing challenges effortlessly
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className="w-12 h-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-banana" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Image Context</h3>
              <p className="text-muted-foreground">
                Process multiple images simultaneously. Advanced multi-image editing workflows
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2">
              <div className="w-12 h-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-banana" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI UGC Creation</h3>
              <p className="text-muted-foreground">
                Create consistent AI influencers and UGC content. Perfect for social media and marketing
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Lightning-Fast AI Creations</h2>
            <p className="text-lg text-muted-foreground">See what Nano Banana generates in milliseconds</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-square">
                <img
                  src="/majestic-mountain-peak-with-clouds.jpg"
                  alt="Mountain Generation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-banana text-banana-foreground rounded-full text-xs font-semibold">
                  0.8s
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Ultra-Fast Mountain</h3>
                <p className="text-sm text-muted-foreground">Created with optimized neural engine</p>
              </div>
            </Card>

            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-square">
                <img
                  src="/beautiful-zen-garden-with-flowers.jpg"
                  alt="Garden Creation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-banana text-banana-foreground rounded-full text-xs font-semibold">
                  0.9s
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Instant Garden</h3>
                <p className="text-sm text-muted-foreground">Complex scene in milliseconds</p>
              </div>
            </Card>

            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-square">
                <img
                  src="/tropical-beach-at-sunset.jpg"
                  alt="Beach Synthesis"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-banana text-banana-foreground rounded-full text-xs font-semibold">
                  0.7s
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Real-time Beach</h3>
                <p className="text-sm text-muted-foreground">Photorealistic at lightning speed</p>
              </div>
            </Card>

            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-square">
                <img
                  src="/northern-lights-aurora-sky.jpg"
                  alt="Aurora Generation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-banana text-banana-foreground rounded-full text-xs font-semibold">
                  1.0s
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Rapid Aurora</h3>
                <p className="text-sm text-muted-foreground">Advanced effects processed instantly</p>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-banana text-banana-foreground hover:bg-banana/90">
              Try Nano Banana Generator
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Creators Are Saying</h2>
            <p className="text-lg text-muted-foreground">Trusted by professionals worldwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-banana/20 flex items-center justify-center">
                  <span className="text-xl">👨‍🎨</span>
                </div>
                <div>
                  <div className="font-semibold">AIArtistPro</div>
                  <div className="text-sm text-muted-foreground">Digital Creator</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "This editor completely changed my workflow. The character consistency is incredible - miles ahead of
                Flux Kontext!"
              </p>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-banana/20 flex items-center justify-center">
                  <span className="text-xl">👩‍💼</span>
                </div>
                <div>
                  <div className="font-semibold">ContentCreator</div>
                  <div className="text-sm text-muted-foreground">UGC Specialist</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Creating consistent AI influencers has never been easier. It maintains perfect face details across
                edits!"
              </p>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-banana/20 flex items-center justify-center">
                  <span className="text-xl">📸</span>
                </div>
                <div>
                  <div className="font-semibold">PhotoEditor</div>
                  <div className="text-sm text-muted-foreground">Professional Editor</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!"
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about Nano Banana</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What is Nano Banana?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  It's a revolutionary AI image editing model that transforms photos using natural language prompts.
                  This is currently the most powerful image editing model available, with exceptional consistency. It
                  offers superior performance compared to Flux Kontext for consistent character editing and scene
                  preservation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How does it work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Simply upload an image and describe your desired edits in natural language. The AI understands complex
                  instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it".
                  It processes your text prompt and generates perfectly edited images.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How is it better than Flux Kontext?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  This model excels in character consistency, scene blending, and one-shot editing. Users report it
                  "completely destroys" Flux Kontext in preserving facial features and seamlessly integrating edits with
                  backgrounds. It also supports multi-image context, making it ideal for creating consistent AI
                  influencers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Can I use it for commercial projects?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many
                  users leverage it for creating consistent AI influencers and product photography. The high-quality
                  outputs are suitable for professional use.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What types of edits can it handle?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The editor handles complex edits including face completion, background changes, object placement,
                  style transfers, and character modifications. It excels at understanding contextual instructions like
                  "place in a blizzard" or "create the whole face" while maintaining photorealistic quality.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-banana/5 border-2 border-banana/20">
            <div className="max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🍌</div>
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Images?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the power of natural language image editing today
              </p>
              <Button size="lg" className="bg-banana text-banana-foreground hover:bg-banana/90 text-lg px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🍌</div>
              <span className="text-xl font-bold text-banana">Nano Banana</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Nano Banana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
