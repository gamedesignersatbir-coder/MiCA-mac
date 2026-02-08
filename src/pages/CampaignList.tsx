import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, BarChart2, MoreVertical, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

interface Campaign {
    id: string;
    product_name: string;
    status: string;
    created_at: string;
    launch_date: string;
    tone: string;
}

export const CampaignList: React.FC = () => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchCampaigns = async () => {
        try {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCampaigns(data || []);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'tone_preview': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'tone_approved': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'generating': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'plan_ready': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'executing': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    const getLink = (campaign: Campaign) => {
        if (campaign.status === 'tone_preview') return `/campaign/${campaign.id}/tone-preview`;
        if (campaign.status === 'tone_approved') return `/campaign/${campaign.id}/generating`;
        if (campaign.status === 'generating') return `/campaign/${campaign.id}/generating`;
        return `/campaign/${campaign.id}/dashboard`;
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Campaigns</h1>
                        <p className="text-gray-400">Manage and track your marketing initiatives.</p>
                    </div>
                    <Link to="/create-campaign">
                        <Button leftIcon={<Plus className="w-5 h-5" />}>New Campaign</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
                        <Sparkles className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
                        <p className="text-gray-400 mb-6">Create your first AI-powered marketing campaign today.</p>
                        <Link to="/create-campaign">
                            <Button>Start First Campaign</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {campaigns.map((campaign) => (
                            <Link
                                key={campaign.id}
                                to={getLink(campaign)}
                                className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors group"
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                {campaign.product_name}
                                            </h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border uppercase tracking-wide font-bold ${getStatusColor(campaign.status)}`}>
                                                {campaign.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> Launch: {campaign.launch_date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Sparkles className="w-4 h-4" /> Tone: {campaign.tone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <BarChart2 className="w-5 h-5" />
                                        <div className="w-px h-8 bg-gray-800 hidden md:block"></div>
                                        <MoreVertical className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};
