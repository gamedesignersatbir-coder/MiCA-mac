const HEYGEN_API_URL = "/api/heygen/v2/video/generate";
const HEYGEN_STATUS_URL = "/api/heygen/v1/video_status.get";

interface VideoGenerationOptions {
    script: string;
    avatarId?: string;
    voiceId?: string;
}

export async function generateVideo({
    script,
    avatarId = "Daisy-insuit-20220818", // Daisy (Verified)
    voiceId = "007e1378fc454a9f976db570cad080e9"     // Valid Public Voice (Aria/Guy)
}: VideoGenerationOptions): Promise<string> {

    // MOCK IMPLEMENTATION (USER REQUESTED FALLBACK)
    // The HeyGen API is being finicky with specific IDs. 
    // Proceeding with a demo video to unblock the application flow.
    console.log("Generating video with script:", script);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay

    // Returning the landing page demo video
    return "https://dynamic.heygen.ai/aws_pacific/avatar_tmp/1438b17eeed545b981fec8863f8d729d/v5848aa759798480c82ced7c4de123d30/820d52f6f343458792ddf22cfc4ed77e.mp4";
}
