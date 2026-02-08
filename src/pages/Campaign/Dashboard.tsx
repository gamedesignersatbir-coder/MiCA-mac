import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import {
    LayoutDashboard, Mail, MessageSquare, Instagram, Calendar,
    ArrowUpRight, Users, Target, BarChart2, Download
} from 'lucide-react';

interface Campaign {
    id: string;
    product_name: string;
    status: string;
    marketing_plan: any;
    recommended_channels: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface EmailTemplate {
    id: string;
    subject: string;
    pre_header: string;
    body: string;
    scheduled_day: number;
}

interface WhatsAppMessage {
    id: string;
    message_text: string;
    scheduled_day: number;
}

interface SocialPost {
    id: string;
    caption: string;
    hashtags: string;
    scheduled_day: number;
    image_suggestion: string;
    post_type: string;
}

export const Dashboard: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('overview');
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [emails, setEmails] = useState<EmailTemplate[]>([]);
    const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);
    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch Campaign
            const { data: campaignData, error: campaignError } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (campaignError) throw campaignError;
            setCampaign(campaignData);

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

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Layout><div className="flex h-screen justify-center items-center">Loading Dashboard...</div></Layout>;
    if (!campaign) return <Layout><div>Campaign not found</div></Layout>;

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <Target className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-medium">Primary Goal</span>
                    </div>
                    <div className="text-xl font-semibold text-white">
                        {campaign.marketing_plan?.expected_outcomes?.reach || "Maximize Reach"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Expected Reach</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <Users className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium">Target Audience</span>
                    </div>
                    <div className="text-lg font-semibold text-white truncate">
                        {campaign.target_audience}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Persona Segment</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium">Duration</span>
                    </div>
                    <div className="text-xl font-semibold text-white">4 Weeks</div>
                    <div className="text-xs text-gray-500 mt-1">Launch: {campaign.launch_date}</div>
                </div>
            </div>

            {/* Strategy Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" /> Strategy Summary
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                    {campaign.marketing_plan?.strategy_summary || "Strategy failed to load."}
                </p>

                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Weekly Focus</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {campaign.marketing_plan?.weekly_plan?.map((week: any, idx: number) => (
                        <div key={idx} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="text-xs text-indigo-400 font-bold mb-1">WEEK {week.week}</div>
                            <div className="text-white font-medium mb-1">{week.theme}</div>
                            <div className="text-xs text-gray-500">{week.goal}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const [selectedEmail, setSelectedEmail] = useState<EmailTemplate | null>(null);

    const renderEmails = () => (
        <div className="grid gap-4 animate-in fade-in">
            {emails.map((email) => (
                <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Day {email.scheduled_day}</span>
                            <span className="text-gray-900 font-medium truncate max-w-md">{email.subject}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-500">View</Button>
                    </div>
                    <div className="p-4">
                        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Preview Text: {email.pre_header}</div>
                        <div className="text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: email.body }} />
                    </div>
                </div>
            ))}
            {emails.length === 0 && <div className="text-center py-10 text-gray-500">No emails generated.</div>}

            {/* Email Detail Modal */}
            {selectedEmail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEmail(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedEmail.subject}</h3>
                                <p className="text-sm text-gray-500">Day {selectedEmail.scheduled_day} • {selectedEmail.pre_header}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(null)}>Close</Button>
                        </div>
                        <div className="p-8 prose prose-indigo max-w-none text-gray-800">
                            <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
                            <Button onClick={() => setSelectedEmail(null)}>Done</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderWhatsApp = () => (
        <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in">
            {whatsappMessages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {msg.scheduled_day}
                    </div>
                    <div className="bg-[#DCF8C6] text-gray-900 p-3 rounded-lg rounded-tl-none shadow-sm text-sm relative">
                        {msg.message_text}
                        <div className="text-[10px] text-gray-500 text-right mt-1 opacity-70">
                            Scheduled: Day {msg.scheduled_day}
                        </div>
                    </div>
                </div>
            ))}
            {whatsappMessages.length === 0 && <div className="text-center py-10 text-gray-500">No WhatsApp messages generated.</div>}
        </div>
    );

    const renderSocial = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {socialPosts.map((post) => (
                <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="aspect-square bg-gray-800 flex items-center justify-center p-4 text-center border-b border-gray-800">
                        <span className="text-xs text-gray-500 italic">{post.image_suggestion}</span>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-pink-500/10 text-pink-400 text-[10px] font-bold px-2 py-1 rounded">Day {post.scheduled_day}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{post.post_type?.replace('_', ' ')}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-4 mb-3">{post.caption}</p>
                        <p className="text-xs text-blue-400">{post.hashtags}</p>
                    </div>
                </div>
            ))}
            {socialPosts.length === 0 && <div className="text-center py-10 text-gray-500">No social posts generated.</div>}
        </div>
    );

    const handleLaunch = async () => {
        if (!campaign) return;
        try {
            const { error } = await supabase
                .from('campaigns')
                .update({ status: 'executing' })
                .eq('id', campaign.id);

            if (error) throw error;
            setCampaign({ ...campaign, status: 'executing' });
            alert("Campaign Launched Successfully! 🚀");
        } catch (error) {
            console.error("Error launching campaign:", error);
            alert("Failed to launch campaign.");
        }
    };

    const handleExport = () => {
        window.print();
        // In Session 3, we can implement PDF generation
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-white">{campaign.product_name}</h1>
                            <span className={`text-xs px-2 py-0.5 rounded-full border uppercase tracking-wide font-bold ${campaign.status === 'executing'
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                                }`}>
                                {campaign.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Campaign Dashboard</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>Export Plan</Button>
                        {campaign.status !== 'executing' && (
                            <Button onClick={handleLaunch} leftIcon={<ArrowUpRight className="w-4 h-4" />}>Launch Campaign</Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-800 mb-8 overflow-x-auto">
                    <div className="flex space-x-6 min-w-max">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview'
                                ? 'border-indigo-500 text-indigo-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('emails')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'emails'
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            <Mail className="w-4 h-4" /> Emails
                            <span className="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">{emails.length}</span>
                        </button>
                        {campaign.recommended_channels.includes('whatsapp') && (
                            <button
                                onClick={() => setActiveTab('whatsapp')}
                                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'whatsapp'
                                    ? 'border-green-500 text-green-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" /> WhatsApp
                                <span className="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">{whatsappMessages.length}</span>
                            </button>
                        )}
                        {campaign.recommended_channels.includes('instagram') && (
                            <button
                                onClick={() => setActiveTab('social')}
                                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'social'
                                    ? 'border-pink-500 text-pink-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <Instagram className="w-4 h-4" /> Instagram
                                <span className="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">{socialPosts.length}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'emails' && renderEmails()}
                    {activeTab === 'whatsapp' && renderWhatsApp()}
                    {activeTab === 'social' && renderSocial()}
                </div>
            </div>
        </Layout>
    );
};
