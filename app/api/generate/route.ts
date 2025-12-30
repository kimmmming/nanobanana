import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // 可按需改成你的正式站点
    "X-Title": "Nano Banana",
  },
})

export async function POST(req: Request) {
  try {
    const { image, prompt } = (await req.json()) as { image?: string; prompt?: string }

    if (!image || !prompt) {
      return new Response(JSON.stringify({ error: "Missing image or prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY is not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              // 前端传来的就是 dataURL，例如 data:image/png;base64,xxx
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
    })

    const message: any = completion.choices?.[0]?.message
    console.log("Model response:", JSON.stringify(message, null, 2))

    let generatedImageUrl: string | undefined

    // 1. 检查 images 数组（Gemini 2.5 Flash Image 返回格式）
    if (Array.isArray(message?.images) && message.images.length > 0) {
      const imageItem = message.images[0]
      generatedImageUrl = imageItem?.image_url?.url || imageItem?.image_url
    }

    // 2. 从 content 里找 image_url
    if (!generatedImageUrl) {
      const generatedPart =
        Array.isArray(message?.content) &&
        message.content.find((p: any) => p?.type === "image_url" && p?.image_url?.url)
      generatedImageUrl = generatedPart?.image_url?.url
    }

    // 3. 从 text 里解析 URL
    if (!generatedImageUrl) {
      const textPart =
        Array.isArray(message?.content) &&
        message.content.find((p: any) => p?.type === "text" && typeof p?.text === "string")

      const text: string | undefined = textPart?.text
      if (text) {
        const match = text.match(/https?:\/\/\S+/)
        if (match) {
          generatedImageUrl = match[0]
        }
      }
    }

    if (!generatedImageUrl) {
      console.log("No image URL found in response, returning raw message for debugging")
      return new Response(
        JSON.stringify({
          error: "No image returned from model",
          rawMessage: message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return new Response(JSON.stringify({ image: generatedImageUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    console.error("Gemini 2.5 Flash Image API error:", err)
    return new Response(
      JSON.stringify({
        error: err?.message ?? "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}


