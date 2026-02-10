
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Replicate from 'replicate';
import fetch from 'node-fetch';

// Load env vars
dotenv.config();

const replicate = new Replicate({
    auth: process.env.VITE_REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN,
});

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'demo-assets');

const POSTS = [
    {
        id: 3,
        prompt: "Before/after split. Left: dark, blue-toned, person stressed at desk with messy surroundings. Right: warm, golden-toned, same person peacefully meditating with organized space. Clean typography. High quality, realistic."
    },
    {
        id: 4,
        prompt: "Professional but warm portrait-style image of a female yoga instructor in a calm setting — seated comfortably with natural lighting. Plants and warm tones in background. Welcoming expression. High quality, photorealistic."
    },
    {
        id: 5,
        prompt: "Clean infographic showing a brain illustration with labeled benefits radiating outward. Modern, professional design with green and indigo accents on dark background."
    },
    {
        id: 6,
        prompt: "Testimonial card design with quote marks, person silhouette or avatar, and the quote text. Professional layout. Stars or rating element. Warm colors."
    },
    {
        id: 7,
        prompt: "Progress bar or counter graphic showing 187/250 filled. Bold numbers. Sense of urgency. Dark background with bright accent colors. Clean and modern."
    },
    {
        id: 8,
        prompt: "Contemplative lifestyle image — person sitting by window with cup of tea, looking peaceful and reflective. Warm natural lighting. Cozy, authentic feel."
    },
    {
        id: 9,
        prompt: "Clean FAQ/info card design. Multiple small sections with icons. Easy to scan. Professional layout like a course brochure. Green and white accents."
    },
    {
        id: 10,
        prompt: "Bold countdown graphic — large numbers showing '27 spots left'. Urgent colors (red accent). Clock or timer/alarm element. Dark background with high contrast text."
    }
];

async function downloadImage(url, filepath) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(filepath, buffer);
    console.log(`Saved: ${filepath}`);
}

async function generate() {
    console.log("Starting generation for 8 images...");

    // Ensure directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const post of POSTS) {
        console.log(`Generating Post ${post.id}: ${post.prompt.substring(0, 30)}...`);
        try {
            const output = await replicate.run(
                "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                {
                    input: {
                        prompt: post.prompt,
                        width: 1024,
                        height: 1024,
                        num_outputs: 1
                    }
                }
            );

            if (output && output[0]) {
                const imageUrl = output[0];
                const filename = `post-${post.id}.png`;
                await downloadImage(imageUrl, path.join(OUTPUT_DIR, filename));
            } else {
                console.error(`Failed to generate Post ${post.id}: No output`);
            }
        } catch (error) {
            console.error(`Error generating Post ${post.id}:`, error);
        }
    }
    console.log("Done!");
}

generate();
