import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Circle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Layout } from '../../components/Layout';
import { callAI } from '../../services/aiService';
import { generateImage } from '../../services/imageService';
import { buildImagePrompt } from '../../services/imagePromptBuilder';
import { generateVideo } from '../../services/videoService';
import { HEYGEN_CONFIG } from '../../config/heygen';

interface Campaign {
    id: string;
    product_name: string;
    product_description: string;
    target_audience: string;
    tone: string;
    tone_custom_words: string;
    budget: number;
    recommended_channels: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const STEPS = [
    { id: 'strategy', label: 'Building marketing strategy...' },
    { id: 'emails', label: 'Creating email templates...' },
    { id: 'content', label: 'Generating social & messaging content...' },
    { id: 'images', label: 'Creating branded images... (this takes 1-2 mins)' },
    { id: 'video_script', label: 'Writing video script...' },
    { id: 'video', label: 'Generating video introduction... (2-5 mins)' },
    { id: 'finalize', label: 'Finalizing campaign plan...' }
];

export const GeneratingCampaign: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [currentStep, setCurrentStep] = useState(0); // 0 to STEPS.length - 1
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [progressText, setProgressText] = useState("");
    const generationStartedRef = useRef(false);

    useEffect(() => {
        fetchCampaign();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchCampaign = async () => {
        if (!id) return;
        try {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setCampaign(data);

            // If already generated, redirect to dashboard
            if (data.status === 'plan_ready' || data.status === 'approved' || data.status === 'executing') {
                navigate(`/campaign/${id}/dashboard`);
            } else if (!generationStartedRef.current && data.status === 'tone_approved') {
                // Auto-start generation
                startGeneration(data);
            }

        } catch (error) {
            console.error('Error fetching campaign:', error);
            setError('Failed to load campaign data');
        }
    };

    const startGeneration = async (campaignData: Campaign) => {
        if (generationStartedRef.current) return;
        generationStartedRef.current = true;
        setError(null);

        try {
            // Update status to generating
            await supabase.from('campaigns').update({ status: 'generating' }).eq('id', campaignData.id);

            // 1. Marketing Strategy
            setCurrentStep(0);
            const strategy = await generateStrategy(campaignData);
            setCompletedSteps(prev => [...prev, 'strategy']);

            // 2. Email Templates
            setCurrentStep(1);
            await generateEmails(campaignData, strategy);
            setCompletedSteps(prev => [...prev, 'emails']);

            // 3. WhatsApp & Social Content
            setCurrentStep(2);
            await generateContent(campaignData);
            setCompletedSteps(prev => [...prev, 'content']);

            // 4. Image Generation
            setCurrentStep(3);
            await generateImages(campaignData);
            setCompletedSteps(prev => [...prev, 'images']);

            // 5. Video Script
            setCurrentStep(4);
            const script = await generateVideoScript(campaignData, strategy);
            setCompletedSteps(prev => [...prev, 'video_script']);

            // 6. Video Generation
            setCurrentStep(5);
            // Don't await video generation fully if it takes too long, 
            // but for now we'll await it as per requirements with a timeout handling in service?
            // The service waits for completion. We should probably proceed if it fails or use fallback.
            await generateCampaignVideo(campaignData, script);
            setCompletedSteps(prev => [...prev, 'video']);

            // 7. Finalize
            setCurrentStep(6);
            await finalizeCampaign(campaignData.id, strategy);
            setCompletedSteps(prev => [...prev, 'finalize']);

            // Done!
            setTimeout(() => {
                navigate(`/campaign/${campaignData.id}/dashboard`);
            }, 1000);

        } catch (err: any) {
            console.error("Generation Sequence Error:", err);
            setError(err.message || "An error occurred during generation. Please try again.");
            generationStartedRef.current = false; // Allow retry
        }
    };

    // --- API CALL 1: STRATEGY ---
    const generateStrategy = async (campaignData: Campaign) => {
        const prompt = `Generate a 4-week marketing campaign plan for:
PRODUCT: ${campaignData.product_name}
DESC: ${campaignData.product_description}
AUDIENCE: ${campaignData.target_audience}
TONE: ${campaignData.tone} ${campaignData.tone === 'Custom' ? `(${campaignData.tone_custom_words})` : ''}
BUDGET: ₹${campaignData.budget}
CHANNELS: ${JSON.stringify(campaignData.recommended_channels)}

The output MUST be valid JSON matching the schema:
{
  "campaign_name": "string",
  "strategy_summary": "string",
  "target_persona": "string",
  "channels": ["string"],
  "weekly_plan": [{ "week": 1, "theme": "string", "goal": "string", "tactics": [{ "day": 1, "channel": "string", "action": "string", "description": "string" }] }],
  "budget_allocation": { "channel_name": number },
  "expected_outcomes": { "reach": "string", "engagement_rate": "string", "conversion_estimate": "string" }
}`;

        const systemPrompt = `You are an expert marketing strategist. Return ONLY valid JSON. No markdown.`;

        const response = await callAI({ systemPrompt, userPrompt: prompt, temperature: 0.7 });
        const strategyJson = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

        // Save partial strategy
        await supabase.from('campaigns').update({ marketing_plan: strategyJson }).eq('id', campaignData.id);
        return strategyJson;
    };

    // --- API CALL 2: EMAILS ---
    const generateEmails = async (campaignData: Campaign, strategy: any) => {
        const prompt = `Generate 5 marketing emails for this campaign.
STRATEGY SUMMARY: ${strategy.strategy_summary}
TONE: ${campaignData.tone}

Output JSON format:
{
  "emails": [
    {
      "template_order": 1,
      "subject": "string",
      "pre_header": "string",
      "body": "HTML string with simple formatting",
      "cta_text": "string",
      "scheduled_day": 1
    }
  ]
}
Rules:
- 5 emails total
- Spread over 28 days
- HTML body should be clean, use <p>, <br>, <strong>`;

        const systemPrompt = `You are an email marketing expert. Return ONLY valid JSON.`;

        const response = await callAI({ systemPrompt, userPrompt: prompt, temperature: 0.7 });
        const emailsJson = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

        const emailsToInsert = emailsJson.emails.map((e: any) => ({
            campaign_id: campaignData.id,
            ...e
        }));

        const { error } = await supabase.from('email_templates').insert(emailsToInsert);
        if (error) throw error;
    };

    // --- API CALL 3: CONTENT ---
    const generateContent = async (campaignData: Campaign) => {
        // WhatsApp Generation
        if (campaignData.recommended_channels.includes('whatsapp')) {
            const waPrompt = `Generate 12 WhatsApp messages for a 4-week campaign:
PRODUCT: ${campaignData.product_name}
TONE: ${campaignData.tone}
Output JSON: { "whatsapp_messages": [{ "message_order": 1, "message_text": "string", "message_type": "string", "scheduled_day": 1 }] }
Rule: Distribute messages evenly across days 1 to 28 (e.g., Day 1, 3, 7, 10, 14, 17, 21, 24, 28).`;

            const waResponse = await callAI({
                systemPrompt: "You are a WhatsApp marketing expert. Return valid JSON.",
                userPrompt: waPrompt,
                temperature: 0.8
            });
            const waJson = JSON.parse(waResponse.replace(/```json\n?|\n?```/g, '').trim());

            if (waJson.whatsapp_messages?.length > 0) {
                const waToInsert = waJson.whatsapp_messages.map((m: any) => ({
                    campaign_id: campaignData.id,
                    ...m
                }));
                const { error } = await supabase.from('whatsapp_messages').insert(waToInsert);
                if (error) throw error;
            }
        }

        // Social Media Generation
        if (campaignData.recommended_channels.includes('instagram')) {
            const socialPrompt = `Generate 15 Instagram posts for a 4-week campaign:
PRODUCT: ${campaignData.product_name}
TONE: ${campaignData.tone}
Output JSON: { "social_posts": [{ "post_order": 1, "caption": "string", "hashtags": "string", "scheduled_day": 1, "image_suggestion": "string" }] }
Rule: Distribute posts evenly across days 1 to 28.`;

            const socialResponse = await callAI({
                systemPrompt: "You are an Instagram expert. Return valid JSON.",
                userPrompt: socialPrompt,
                temperature: 0.8
            });
            const socialJson = JSON.parse(socialResponse.replace(/```json\n?|\n?```/g, '').trim());

            if (socialJson.social_posts?.length > 0) {
                const postsToInsert = socialJson.social_posts.map((p: any) => ({
                    campaign_id: campaignData.id,
                    ...p,
                    platform: 'instagram'
                }));
                const { error } = await supabase.from('social_posts').insert(postsToInsert);
                if (error) throw error;
            }
        }
    };

    // --- API CALL 4: IMAGES ---
    const generateImages = async (campaignData: Campaign) => {
        if (!campaignData.recommended_channels.includes('instagram')) return;

        // Fetch posts that need images
        const { data: posts } = await supabase
            .from('social_posts')
            .select('*')
            .eq('campaign_id', campaignData.id)
            .eq('platform', 'instagram')
            .order('scheduled_day', { ascending: true });

        if (!posts || posts.length === 0) return;

        let completed = 0;
        const total = posts.length;

        for (const post of posts) {
            if (!post.image_suggestion) continue;

            completed++;
            setProgressText(`Generating image ${completed} of ${total}...`);

            try {
                const prompt = buildImagePrompt(post.image_suggestion, campaignData.product_name, campaignData.tone);
                const imageUrl = await generateImage({ prompt });

                // Save to generated_images
                await supabase.from('generated_images').insert({
                    campaign_id: campaignData.id,
                    image_url: imageUrl,
                    image_prompt: prompt,
                    image_order: post.post_order,
                    image_type: 'social'
                });

                // Update social post
                await supabase.from('social_posts').update({ image_url: imageUrl }).eq('id', post.id);
            } catch (err) {
                console.error(`Failed to generate image for post ${post.id}`, err);
                // Continue to next image even if one fails
            }
        }
        setProgressText("");
    };

    // --- API CALL 5: VIDEO SCRIPT ---
    const generateVideoScript = async (campaignData: Campaign, strategy: any) => {
        const prompt = `CONTEXT:
PRODUCT: ${campaignData.product_name}
STRATEGY SUMMARY: ${strategy.strategy_summary}
CHANNELS: ${campaignData.recommended_channels.join(', ')}

Please write the video script based on the system instructions.`;

        const systemPrompt = `You are MiCA's video scriptwriter. Write a 60-second video script for an AI avatar spokesperson to present a marketing campaign summary.

The avatar will be speaking directly to the business owner, presenting their campaign strategy in an encouraging, professional tone.

Respond in valid JSON only.

Response format:
{
  "script": "The complete spoken script. Write in natural, conversational spoken English. NOT formal report language. Include natural pauses indicated by '...' where appropriate. Must be 120-150 words (60 seconds at normal speaking pace). Address the viewer directly as 'you' and 'your'."
}

Rules:
- Start with a warm greeting and the product name
- Briefly describe the campaign approach (1-2 sentences)
- Highlight the 3 most important tactics across the 4 weeks
- Mention the channels being used
- End with an encouraging, motivational closing
- Keep it under 150 words (CRITICAL — longer scripts = longer/expensive videos)
- Speak naturally — contractions, simple words, like a friendly marketing consultant
- Reference Indian context naturally if the product is India-focused
- Do NOT use any visual directions or camera cues — this is audio/speech only`;

        const response = await callAI({ systemPrompt, userPrompt: prompt, temperature: 0.7 });
        const scriptJson = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

        await supabase.from('campaigns').update({ video_script: scriptJson.script }).eq('id', campaignData.id);
        return scriptJson.script;
    };

    // --- API CALL 6: VIDEO GENERATION ---
    const generateCampaignVideo = async (campaignData: Campaign, script: string) => {
        // HeyGen Fallback Logic
        if (!HEYGEN_CONFIG.API_ENABLED) {
            await supabase.from('campaigns').update({
                video_url: HEYGEN_CONFIG.FALLBACK_VIDEO_URL,
                video_status: 'fallback'
            }).eq('id', campaignData.id);
            return;
        }

        try {
            await supabase.from('campaigns').update({ video_status: 'generating' }).eq('id', campaignData.id);

            const videoUrl = await generateVideo({ script });

            await supabase.from('campaigns').update({
                video_url: videoUrl,
                video_status: 'completed'
            }).eq('id', campaignData.id);

        } catch (err) {
            console.error("Video Generation Failed:", err);
            // Fallback on error
            await supabase.from('campaigns').update({
                video_url: HEYGEN_CONFIG.FALLBACK_VIDEO_URL, // Use fallback if real gen fails
                video_status: 'failed'
            }).eq('id', campaignData.id);
        }
    };

    // --- API CALL 7: FINALIZE ---
    const finalizeCampaign = async (campaignId: string, _strategy: any) => {
        await supabase.from('campaigns').update({ status: 'plan_ready' }).eq('id', campaignId);
    };


    const handleRetry = () => {
        if (campaign) {
            generationStartedRef.current = false;
            startGeneration(campaign);
        }
    };

    if (!campaign && !error) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-6 relative">
                        <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
                        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-spin-slow"></div>
                    </div>
                    <h1 className="text-3xl font-bold mb-3">Creating Your Campaign</h1>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        MiCA is designing your assets, generating images, and producing your strategy video.
                    </p>
                </div>

                <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <div className="space-y-6">
                        {STEPS.map((step, index) => {
                            const isCompleted = completedSteps.includes(step.id);
                            const isCurrent = currentStep === index && !error;
                            // const isPending = !isCompleted && !isCurrent;

                            return (
                                <div key={step.id} className="flex items-center gap-4 transition-all duration-500">
                                    <div className="flex-shrink-0">
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in" />
                                        ) : isCurrent ? (
                                            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-700" />
                                        )}
                                    </div>
                                    <div className={`text-sm font-medium flex-1 ${isCompleted ? 'text-gray-300' :
                                        isCurrent ? 'text-white' :
                                            'text-gray-600'
                                        }`}>
                                        {step.label}
                                        {isCurrent && progressText && step.id === 'images' && (
                                            <div className="text-xs text-indigo-400 mt-1">{progressText}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {error && (
                        <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-xl text-center animate-in fade-in">
                            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                            <p className="text-red-200 text-sm mb-4">{error}</p>
                            <Button onClick={handleRetry} className="w-full bg-red-600 hover:bg-red-700">
                                Retry Generation
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-xs text-gray-500">
                    Do not close this window while generation is in progress.
                </div>
            </div>
        </Layout>
    );
};
