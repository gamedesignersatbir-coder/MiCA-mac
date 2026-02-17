import { supabase } from '../lib/supabase';

const REPLICATE_API_URL = "/api/replicate/models/google/nano-banana-pro/predictions";

interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
}

/**
 * Generates an image via Replicate, then uploads it to Supabase Storage
 * so the URL persists (Replicate URLs expire after ~1 hour).
 */
export async function generateImage({ prompt, width = 1080, height = 1080 }: ImageGenerationOptions): Promise<string> {
  // Step 1: Create prediction on Replicate
  const createResponse = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        width: width,
        height: height,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 50
      }
    })
  });

  if (!createResponse.ok) {
    throw new Error(`Replicate API Error: ${createResponse.statusText}`);
  }

  const prediction = await createResponse.json();

  // Step 2: Poll for completion
  let result = prediction;
  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const getUrl = result.urls.get.replace('https://api.replicate.com/v1', '/api/replicate');

    const pollResponse = await fetch(getUrl, {
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_REPLICATE_API_TOKEN}`
      }
    });
    result = await pollResponse.json();
  }

  if (result.status === "failed") {
    throw new Error(`Image generation failed: ${result.error || "Unknown error"}`);
  }

  // Step 3: Get the temporary Replicate URL
  const replicateUrl = Array.isArray(result.output) ? result.output[0] : result.output;

  // Step 4: Upload to Supabase Storage for persistence
  try {
    const persistentUrl = await uploadToSupabaseStorage(replicateUrl);
    return persistentUrl;
  } catch (err) {
    console.warn('[ImageService] Failed to upload to Supabase Storage, falling back to Replicate URL:', err);
    // Fallback to Replicate URL if storage upload fails
    return replicateUrl;
  }
}

/**
 * Downloads an image from a URL and uploads it to Supabase Storage.
 * Returns the public URL from Supabase.
 */
async function uploadToSupabaseStorage(imageUrl: string): Promise<string> {
  // Download the image
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error('Failed to download image from Replicate');

  const blob = await response.blob();

  // Generate a unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const fileName = `campaign-images/${timestamp}-${randomId}.webp`;

  // Upload to Supabase Storage bucket "campaign-assets"
  const { error: uploadError } = await supabase.storage
    .from('campaign-assets')
    .upload(fileName, blob, {
      contentType: blob.type || 'image/webp',
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
  }

  // Get the public URL
  const { data } = supabase.storage
    .from('campaign-assets')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Attempts to migrate an existing Replicate URL to Supabase Storage.
 * Returns the new persistent URL, or null if the image is no longer accessible.
 */
export async function migrateImageUrl(replicateUrl: string): Promise<string | null> {
  try {
    // Check if already a Supabase URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (replicateUrl.includes(supabaseUrl)) {
      return replicateUrl; // Already migrated
    }

    const persistentUrl = await uploadToSupabaseStorage(replicateUrl);
    return persistentUrl;
  } catch {
    console.warn('[ImageService] Could not migrate image URL (likely expired):', replicateUrl);
    return null;
  }
}
