const HEYGEN_API_URL = "/api/heygen/v1/video_agent/generate";
const HEYGEN_STATUS_URL = "/api/heygen/v1/video_status.get";

interface VideoGenerationOptions {
    prompt: string;
}

export async function generateVideo({
    prompt
}: VideoGenerationOptions): Promise<string> {
    console.log("Generating video with Video Agent prompt:", prompt);

    try {
        // Step 1: Initiate Video Generation
        const response = await fetch(HEYGEN_API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': import.meta.env.VITE_HEYGEN_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HeyGen API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const videoId = data.data.video_id;

        if (!videoId) {
            throw new Error("No video_id returned from HeyGen");
        }

        // Step 2: Poll for completion
        let status = "processing";
        let videoUrl = "";

        while (status === "processing" || status === "pending") {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s

            const statusResponse = await fetch(`${HEYGEN_STATUS_URL}?video_id=${videoId}`, {
                headers: {
                    'X-Api-Key': import.meta.env.VITE_HEYGEN_API_KEY
                }
            });

            if (!statusResponse.ok) {
                console.warn("Status check failed, retrying...");
                continue;
            }

            const statusData = await statusResponse.json();
            status = statusData.data.status;

            if (status === "completed") {
                videoUrl = statusData.data.video_url;
            } else if (status === "failed") {
                throw new Error(`Video generation failed: ${statusData.data.error || "Unknown error"}`);
            }
        }

        return videoUrl;
    } catch (error) {
        console.error("Video Generation Service Error:", error);
        throw error;
    }
}

export async function checkVideoStatus(_videoId: string): Promise<string> {
    // Mock status check
    return "completed";
}
