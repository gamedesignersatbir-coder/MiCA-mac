const REPLICATE_API_URL = "/api/replicate/models/bytedance/seedream-4/predictions";

interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
}

export async function generateImage({ prompt, width = 1080, height = 1080 }: ImageGenerationOptions): Promise<string> {
  // Step 1: Create prediction
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
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls

    // URL returned by Replicate is absolute (e.g., https://api.replicate.com/v1/predictions/xyz)
    // We need to route it through our proxy
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

  // Return the image URL (Replicate hosts the output temporarily)
  return Array.isArray(result.output) ? result.output[0] : result.output;
}
