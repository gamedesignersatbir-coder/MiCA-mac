import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import {
    LayoutDashboard, Mail, MessageSquare, Instagram,
    ArrowLeft, Video, Mic, CheckCircle2, PauseCircle, PlayCircle, Send
} from 'lucide-react';
import { VideoPlayer, SocialPostCard } from '../../components/DashboardComponents';
import { LaunchSection } from '../../components/Dashboard/LaunchSection';
import { CampaignTimeline } from '../../components/Dashboard/CampaignTimeline';
import { ExecutionLog } from '../../components/Dashboard/ExecutionLog';
import { generateImage } from '../../services/imageService';
import { buildImagePrompt } from '../../services/imagePromptBuilder';
import { pauseCampaign, resumeCampaign, triggerWebhook } from '../../services/executionService';
import { DEMO_MODE_ENABLED, DEMO_CAMPAIGN } from '../../data/demoData';

interface Campaign {
    id: string;
    product_name: string;
    status: string;
    marketing_plan: any;
    recommended_channels: string[];
    video_url?: string;
    video_status?: string;
    video_script?: string;
    target_audience: string;
    launch_date?: string;
    campaign_start_date?: string;
    budget: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface EmailTemplate {
    id: string;
    subject: string;
    pre_header: string;
    body: string;
    scheduled_day: number;
    cta_text: string;
}

interface WhatsAppMessage {
    id: string;
    message_text: string;
    scheduled_day: number;
    message_type: string;
}

interface SocialPost {
    id: string;
    caption: string;
    hashtags: string;
    scheduled_day: number;
    image_suggestion: string;
    post_type: string;
    image_url?: string;
    post_order?: number;
}

export const Dashboard: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [emails, setEmails] = useState<EmailTemplate[]>([]);
    const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);
    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
    const [recipientCount, setRecipientCount] = useState(0);
    const [sendingTest, setSendingTest] = useState<string | null>(null); // ID of asset being tested

    useEffect(() => {
        if (id) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Poll for video completion when video is still generating
    useEffect(() => {
        if (!campaign || campaign.video_status !== 'generating') return;

        const interval = setInterval(async () => {
            try {
                const { data } = await supabase
                    .from('campaigns')
                    .select('video_url, video_status')
                    .eq('id', campaign.id)
                    .single();

                if (data && data.video_status !== 'generating') {
                    setCampaign(prev => prev ? { ...prev, video_url: data.video_url, video_status: data.video_status } : prev);
                    clearInterval(interval);
                }
            } catch (err) {
                console.error('Video status poll error:', err);
            }
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [campaign?.video_status, campaign?.id]);

    const fetchData = async () => {
        try {
            if (!id) return;

            // DEMO MODE CHECK
            if (DEMO_MODE_ENABLED()) {
                setCampaign(DEMO_CAMPAIGN as any);

                setRecipientCount(1250); // Hardcoded demo count
                setEmails(DEMO_CAMPAIGN.email_templates as any[]);
                setWhatsappMessages(DEMO_CAMPAIGN.whatsapp_messages as any[]);
                setSocialPosts(DEMO_CAMPAIGN.social_posts as any[]);

                // Set initial tab based on demo status
                const currentStatus = DEMO_CAMPAIGN.status;
                if (currentStatus === 'executing' || currentStatus === 'paused') {
                    setActiveTab('campaign_live');
                } else {
                    setActiveTab('overview');
                }
                setLoading(false);
                return;
            }

            // Fetch Campaign
            const { data: campaignData, error: campaignError } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (campaignError) throw campaignError;
            setCampaign(campaignData);

            // Fetch Recipient Count (using customer_data)
            const { count } = await supabase
                .from('customer_data')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id);
            setRecipientCount(count || 0);

            // Fetch Emails
            const { data: emailData } = await supabase
                .from('email_templates')
                .select('*')
                .eq('campaign_id', id)
                .order('scheduled_day', { ascending: true });
            if (emailData) setEmails(emailData);

            // Fetch WhatsApp
            const { data: waData } = await supabase
                .from('whatsapp_messages')
                .select('*')
                .eq('campaign_id', id)
                .order('scheduled_day', { ascending: true });
            if (waData) setWhatsappMessages(waData);

            // Fetch Social
            const { data: socialData } = await supabase
                .from('social_posts')
                .select('*')
                .eq('campaign_id', id)
                .order('scheduled_day', { ascending: true });
            if (socialData) setSocialPosts(socialData);

            // Set initial tab based on status
            if (campaignData.status === 'executing' || campaignData.status === 'paused') {
                setActiveTab('campaign_live');
            } else {
                setActiveTab('overview');
            }

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateImage = async (postId: string, suggestion: string) => {
        if (!campaign) return;
        setGeneratingImageId(postId);
        try {
            const prompt = buildImagePrompt(suggestion, campaign.product_name, campaign.marketing_plan?.tone || 'Professional');
            const imageUrl = await generateImage({ prompt });

            // Save to DB
            await supabase.from('social_posts').update({ image_url: imageUrl }).eq('id', postId);
            await supabase.from('generated_images').insert({
                campaign_id: campaign.id,
                image_url: imageUrl,
                image_prompt: prompt,
                image_type: 'social'
            });

            // Update local state
            setSocialPosts(prev => prev.map(p => p.id === postId ? { ...p, image_url: imageUrl } : p));

        } catch (error) {
            console.error("Failed to regenerate image:", error);
            alert("Failed to generate image. Please try again.");
        } finally {
            setGeneratingImageId(null);
        }
    };

    const handleSendTest = async (assetId: string, type: 'email' | 'whatsapp', content: any) => {
        setSendingTest(assetId);
        try {
            await triggerWebhook('send_test', {
                campaign_id: campaign?.id,
                action: 'send_test',
                type,
                content
            });
            alert("Test sent successfully!");
        } catch (error) {
            console.error("Test send failed:", error);
            alert("Failed to send test.");
        } finally {
            setSendingTest(null);
        }
    };

    const handlePauseResume = async () => {
        if (!campaign) return;
        try {
            if (campaign.status === 'executing') {
                if (confirm("Pause this campaign? Scheduled tasks will NOT execute until resumed.")) {
                    await pauseCampaign(campaign.id);
                    setCampaign({ ...campaign, status: 'paused' });
                }
            } else if (campaign.status === 'paused') {
                await resumeCampaign(campaign.id);
                setCampaign({ ...campaign, status: 'executing' });
            }
        } catch (error) {
            console.error("Failed to toggle campaign status:", error);
            alert("Failed to update status.");
        }
    };

    if (loading) return (
        <Layout>
            <div className="min-h-screen bg-black text-white">
                <div className="border-b border-gray-800 px-6 py-4">
                    <div className="h-8 w-64 bg-gray-900 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] h-[calc(100vh-73px)]">
                    <div className="border-r border-gray-800 bg-gray-950 p-6 space-y-8">
                        <div className="aspect-[9/16] bg-gray-900 rounded-2xl animate-pulse"></div>
                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-gray-900 rounded animate-pulse"></div>
                            <div className="h-24 bg-gray-900 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="flex gap-4 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 w-32 bg-gray-900 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="h-40 bg-gray-900 rounded-xl animate-pulse"></div>
                            <div className="h-40 bg-gray-900 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    ); if (!campaign) return <Layout><div className="text-white p-8">Campaign not found</div></Layout>;

    const isLive = campaign.status === 'executing' || campaign.status === 'paused';

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in">
            {/* Strategy Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-indigo-400" /> Strategy Overview
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Executive Summary</h4>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            {campaign.marketing_plan?.strategy_summary || "Strategy failed to load."}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase">Target Audience</div>
                                <div className="text-white font-medium">{campaign.target_audience}</div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase">Primary Goal</div>
                                <div className="text-white font-medium">{campaign.marketing_plan?.expected_outcomes?.reach || "Maximize Reach"}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Weekly Focus</h4>
                        <div className="space-y-3">
                            {campaign.marketing_plan?.weekly_plan?.map((week: any, idx: number) => (
                                <div key={idx} className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50 flex gap-4 items-start">
                                    <div className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded mt-0.5">W{week.week}</div>
                                    <div>
                                        <div className="text-white text-sm font-medium">{week.theme}</div>
                                        <div className="text-xs text-gray-500">{week.goal}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEmails = () => (
        <div className="grid gap-4 animate-in fade-in">
            {emails.map((email) => (
                <div key={email.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-3">Day {email.scheduled_day}</span>
                            <span className="text-gray-900 font-semibold">{email.subject}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 border-indigo-300 font-medium shadow-sm"
                                onClick={() => handleSendTest(email.id, 'email', email)}
                                disabled={sendingTest === email.id}
                            >
                                <Send className="w-3 h-3 mr-1" />
                                {sendingTest === email.id ? 'Sending...' : 'Send Test'}
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="text-xs text-gray-500 mb-4 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-200">
                            <strong>Preview:</strong> {email.pre_header}
                        </div>
                        <div
                            className="prose prose-sm max-w-none text-gray-600 bg-gray-50/50 p-4 rounded-lg border border-gray-100"
                            dangerouslySetInnerHTML={{ __html: email.body }}
                        />
                        <div className="mt-4 flex justify-end">
                            <span className="text-xs text-gray-400 italic">CTA: {email.cta_text}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderWhatsApp = () => (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in py-4">
            {whatsappMessages.map((msg) => (
                <div key={msg.id} className="relative group">
                    <div className="flex justify-center mb-4">
                        <span className="bg-gray-800 text-gray-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                            Day {msg.scheduled_day}
                        </span>
                    </div>

                    <div className="flex items-end justify-end">
                        <div className="flex flex-col gap-1 items-end max-w-[80%]">
                            <div className="bg-[#005c4b] text-white p-3 rounded-lg rounded-tr-none shadow-md text-sm leading-relaxed relative text-left">
                                {msg.message_text}
                                <div className="text-[10px] text-gray-300 text-right mt-1 flex items-center justify-end gap-1">
                                    <span>10:00 AM</span>
                                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-green-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleSendTest(msg.id, 'whatsapp', msg)}
                                disabled={sendingTest === msg.id}
                            >
                                <Send className="w-3 h-3 mr-1" /> Send Test
                            </Button>
                        </div>
                    </div>
                    <div className="text-right mt-1 mr-1">
                        <span className="text-[10px] text-gray-500 uppercase">{msg.message_type}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSocial = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
            {socialPosts.filter(p => p.post_type !== 'story').map((post) => (
                <SocialPostCard
                    key={post.id}
                    post={post}
                    onGenerateImage={handleGenerateImage}
                    generatingImageId={generatingImageId}
                />
            ))}
        </div>
    );

    const renderVideoAd = () => {
        if (!campaign.recommended_channels.includes('video_ad')) {
            return (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-900 rounded-xl border border-gray-800 text-center">
                    <Video className="w-12 h-12 text-gray-700 mb-4" />
                    <h3 className="text-white font-medium text-lg mb-2">Video Ads Not Recommended</h3>
                    <p className="text-gray-400 max-w-md">
                        Based on your budget of ₹{campaign.budget}, we recommend focusing on organic channels first. Increase budget to ₹25,000+ to unlock video ads.
                    </p>
                </div>
            );
        }

        return (
            <div className="max-w-md mx-auto">
                <VideoPlayer
                    videoUrl={campaign.video_url}
                    isGenerating={campaign.video_status === 'generating'}
                    description="This is your main campaign video ad, optimized for Instagram Reels and YouTube Shorts."
                    script={campaign.video_script}
                    showScript={true}
                />
            </div>
        );
    };

    const renderVoiceAgent = () => (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-900 rounded-xl border border-gray-800 text-center mb-8">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                <Mic className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-white font-medium text-lg mb-2">Voice Agent Setup</h3>
            <p className="text-gray-400 max-w-md mb-6">
                Coming in Session 4: Configure an AI voice agent to handle inbound leads from your campaign.
            </p>
            <Button variant="outline" disabled>Coming Soon</Button>
        </div>
    );

    // Determine which tabs to show based on state
    // If Live, show "Campaign Live" first
    const tabs = [
        ...(isLive ? [{ id: 'campaign_live', label: 'Campaign Live', icon: CheckCircle2, show: true }] : []),
        { id: 'overview', label: 'Strategy', icon: LayoutDashboard, show: true },
        { id: 'emails', label: 'Emails', icon: Mail, show: true },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, show: campaign.recommended_channels.includes('whatsapp') },
        { id: 'social', label: 'Instagram', icon: Instagram, show: campaign.recommended_channels.includes('instagram') },
        { id: 'video_ad', label: 'Video Ad', icon: Video, show: campaign.recommended_channels.includes('video_ad') },
        { id: 'execution_log', label: 'Execution Log', icon: LayoutDashboard, show: true }, // Always show log
        { id: 'voice_agent', label: 'Voice Agent', icon: Mic, show: true }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-black text-white">
                {/* Navbar Area */}
                <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-3">
                                {campaign.product_name}
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide font-bold ${campaign.status === 'executing' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
                                    campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                        campaign.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                    }`}>
                                    {campaign.status.replace('_', ' ')}
                                </span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500 mr-4 hidden md:block">
                            Budget: ₹{campaign.budget.toLocaleString()}
                        </div>

                        {/* Status Actions */}
                        {isLive && (
                            campaign.status === 'executing' ? (
                                <Button
                                    onClick={handlePauseResume}
                                    variant="outline"
                                    className="text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10"
                                >
                                    <PauseCircle className="w-4 h-4 mr-2" /> Pause Campaign
                                </Button>
                            ) : (
                                <Button
                                    onClick={handlePauseResume}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <PlayCircle className="w-4 h-4 mr-2" /> Resume Campaign
                                </Button>
                            )
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] h-[calc(100vh-73px)] overflow-hidden">

                    {/* LEFT PANEL - SCROLLABLE */}
                    <div className="border-r border-gray-800 bg-gray-950 overflow-y-auto p-6 custom-scrollbar">
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Campaign Video</h3>
                            <VideoPlayer
                                videoUrl={campaign.video_url}
                                isGenerating={campaign.video_status === 'generating'}
                                onRetry={async () => {
                                    try {
                                        const { data } = await supabase
                                            .from('campaigns')
                                            .select('video_url, video_status')
                                            .eq('id', campaign.id)
                                            .single();
                                        if (data) {
                                            setCampaign(prev => prev ? { ...prev, video_url: data.video_url, video_status: data.video_status } : prev);
                                        }
                                    } catch (err) {
                                        console.error('Video retry fetch error:', err);
                                    }
                                }}
                                script={campaign.video_script}
                            />
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Summary</h3>
                            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {campaign.marketing_plan?.strategy_summary?.slice(0, 200)}...
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Assets Generated</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm p-3 bg-gray-900 rounded border border-gray-800">
                                    <span className="text-gray-400">Emails</span>
                                    <span className="text-white font-mono">{emails.length}</span>
                                </div>
                                <div className="flex justify-between text-sm p-3 bg-gray-900 rounded border border-gray-800">
                                    <span className="text-gray-400">WhatsApp Msgs</span>
                                    <span className="text-white font-mono">{whatsappMessages.length}</span>
                                </div>
                                <div className="flex justify-between text-sm p-3 bg-gray-900 rounded border border-gray-800">
                                    <span className="text-gray-400">Social Posts</span>
                                    <span className="text-white font-mono">{socialPosts.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL - MAIN CONTENT */}
                    <div className="flex flex-col h-full bg-black overflow-hidden">

                        {/* Tabs */}
                        <div className="flex overflow-x-auto border-b border-gray-800 bg-gray-950/50 px-6">
                            {tabs.map(tab => {
                                if (tab.show === false) return null;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" /> {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-5xl mx-auto">

                                {/* Launch Section (Only visible on Strategy tab when plan_ready) */}
                                {campaign.status === 'plan_ready' && activeTab === 'overview' && (
                                    <LaunchSection
                                        campaignId={campaign.id}
                                        recipientCount={recipientCount}
                                        recommendedChannels={campaign.recommended_channels}
                                        emailCount={emails.length}
                                        whatsappCount={whatsappMessages.length}
                                        socialCount={socialPosts.length}
                                        onLaunchComplete={() => {
                                            // In Demo Mode, update the global object so state persists during navigation
                                            if (DEMO_MODE_ENABLED()) {
                                                DEMO_CAMPAIGN.status = 'executing';
                                            }

                                            setCampaign({ ...campaign, status: 'executing', campaign_start_date: new Date().toISOString().split('T')[0] });
                                            setActiveTab('campaign_live');
                                        }}
                                    />
                                )}

                                {activeTab === 'campaign_live' && isLive && (
                                    <div className="animate-fade-in">
                                        <CampaignTimeline
                                            campaignId={campaign.id}
                                            startDate={campaign.campaign_start_date || new Date().toISOString()}
                                            isPaused={campaign.status === 'paused'}
                                        />
                                    </div>
                                )}

                                {activeTab === 'overview' && <div className="animate-fade-in">{renderOverview()}</div>}
                                {activeTab === 'emails' && <div className="animate-fade-in">{renderEmails()}</div>}
                                {activeTab === 'whatsapp' && <div className="animate-fade-in">{renderWhatsApp()}</div>}
                                {activeTab === 'social' && <div className="animate-fade-in">{renderSocial()}</div>}
                                {activeTab === 'video_ad' && <div className="animate-fade-in">{renderVideoAd()}</div>}
                                {activeTab === 'voice_agent' && <div className="animate-fade-in">{renderVoiceAgent()}</div>}
                                {activeTab === 'execution_log' && <div className="animate-fade-in"><ExecutionLog campaignId={campaign.id} /></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
