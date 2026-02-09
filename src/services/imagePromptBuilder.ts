export function buildImagePrompt(imageSuggestion: string, productName: string, tone: string): string {
    const toneStyles: Record<string, string> = {
        "Professional & Trustworthy": "clean, corporate, minimal, professional photography style, soft lighting, muted elegant colors",
        "Warm & Inspirational": "warm golden light, hopeful, uplifting, natural colors, soft focus background, inspiring atmosphere",
        "Urgent & Action-Oriented": "bold, dynamic, high contrast, vibrant reds and oranges, energetic composition, strong typography space",
        "Casual & Friendly": "bright, cheerful, pastel colors, playful composition, friendly vibe, lifestyle photography style",
        "Custom": "modern, clean, visually appealing, professional marketing style"
    };

    const styleGuide = toneStyles[tone] || toneStyles["Custom"];

    return `Marketing social media post image for "${productName}". ${imageSuggestion}. Style: ${styleGuide}. Square format for Instagram. No text overlays, no watermarks, no logos. High quality, photorealistic.`;
}
