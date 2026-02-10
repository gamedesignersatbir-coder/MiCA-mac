const _HEYGEN_API_URL = "/api/heygen/v2/video/generate";
const _HEYGEN_STATUS_URL = "/api/heygen/v1/video_status.get";

interface VideoGenerationOptions {
    script: string;
    avatarId?: string;
    voiceId?: string;
}

export async function generateVideo({
    script,
    avatarId: _avatarId = "Daisy-insuit-20220818",
    voiceId: _voiceId = "007e1378fc454a9f976db570cad080e9"
}: VideoGenerationOptions): Promise<string> {

    const isApiEnabled = import.meta.env.VITE_HEYGEN_API_ENABLED === 'true';

    console.log(`[VideoService] Generating video. API Enabled: ${isApiEnabled}`);
    console.log(`[VideoService] Script: ${script.substring(0, 50)}...`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (isApiEnabled) {
        // TODO: Implement actual HeyGen API call here
        console.warn("[VideoService] API is enabled but implementation is missing. Falling back to demo video.");
    }

    // Return fallback/demo video
    return "https://dynamic.heygen.ai/aws_pacific/avatar_tmp/1438b17eeed545b981fec8863f8d729d/v5848aa759798480c82ced7c4de123d30/820d52f6f343458792ddf22cfc4ed77e.mp4";
}

export async function checkVideoStatus(_videoId: string): Promise<string> {
    // Mock status check
    return "completed";
}
