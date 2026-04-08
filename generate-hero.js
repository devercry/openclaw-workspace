import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prompt = `Minimalist hero image for an automated linear stage optical platform. 
Clean laboratory setting, sleek silver aluminum linear motion stage with precision optics mounted on top. 
Soft blue-white lighting, shallow depth of field, professional product photography style.
White to light gray gradient background, lots of negative space for text overlay.
Modern, clean, high-tech aesthetic. No text in the image. 16:9 aspect ratio.`;

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image",
  contents: prompt,
  config: {
    imageConfig: {
      aspectRatio: "16:9"
    }
  }
});

const parts = response.candidates?.[0]?.content?.parts ?? [];
for (const part of parts) {
  if (part.text) console.log(part.text);
  if (part.inlineData?.data) {
    fs.writeFileSync("assets/optical-platform-hero.png", Buffer.from(part.inlineData.data, "base64"));
    console.log("✅ Image saved to assets/optical-platform-hero.png");
  }
}
