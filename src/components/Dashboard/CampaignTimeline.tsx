import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, MessageSquare, Instagram, CheckCircle2, Clock, PlayCircle, Calendar, PauseCircle, Eye, X } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DEMO_MODE_ENABLED, DEMO_CAMPAIGN } from '../../data/demoData';

interface ScheduleEntry {
    id: string;
    channel: string;
    asset_type: string;
    asset_id: string;
    scheduled_day: number;
    scheduled_date: string;
    status: string;
    recipients_total: number;
    recipients_sent: number;
    completed_at?: string;
    asset_title?: string;
}

interface CampaignTimelineProps {
    campaignId: string;
    startDate: string;
    isPaused?: boolean;
}

export const CampaignTimeline: React.FC<CampaignTimelineProps> = ({ campaignId, startDate, isPaused = false }) => {
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewItem, setPreviewItem] = useState<any | null>(null);
    const [previewContent, setPreviewContent] = useState<string>('');
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [showAllUpcoming, setShowAllUpcoming] = useState(false);

    // Initial Fetch & Realtime Subscription
    useEffect(() => {
        fetchSchedule();

        // POLL FALLBACK (Vital for when Realtime fails or is delayed)
        // We poll every 2s to ensure the UI stays in sync with the backend simulation
        let pollInterval: NodeJS.Timeout;

        if (!DEMO_MODE_ENABLED()) {
            pollInterval = setInterval(() => {
                fetchSchedule(true); // silent fetch
            }, 2000);

            // Also subscribe to changes for immediate updates if possible
            const channel = supabase
                .channel(`execution-updates-${campaignId}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'execution_schedule',
                    filter: `campaign_id=eq.${campaignId}`
                }, (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        setSchedule(prev => prev.map(entry =>
                            entry.id === (payload.new as any).id ? { ...entry, ...(payload.new as any) } : entry
                        ));
                    } else if (payload.eventType === 'INSERT') {
                        fetchSchedule();
                    }
                })
                .subscribe();

            return () => {
                clearInterval(pollInterval);
                supabase.removeChannel(channel);
            };
        }
    }, [campaignId]);

    const fetchSchedule = async (silent = false) => {
        try {
            if (DEMO_MODE_ENABLED()) {
                // ... demo logic ...
                const start = new Date(startDate);
                const demoSchedule = DEMO_CAMPAIGN.execution_schedule.map(item => ({
                    ...item,
                    scheduled_date: addDays(start, item.scheduled_day - 1).toISOString()
                }));

                const enrichedSchedule = demoSchedule.map(entry => ({
                    ...entry,
                    asset_title: getAssetTitle(entry as any)
                }));

                setSchedule(enrichedSchedule as any);
                if (!silent) setLoading(false);

                // Start client-side simulation if just launched
                const day1Tasks = enrichedSchedule.filter(t => t.scheduled_day === 1 && t.status === 'scheduled');
                if (day1Tasks.length > 0) {
                    simulateDemoProgress(enrichedSchedule as any[]);
                }
                return;
            }

            const { data: scheduleData, error } = await supabase
                .from('execution_schedule')
                .select('*')
                .eq('campaign_id', campaignId)
                .order('scheduled_day', { ascending: true });

            if (error) throw error;

            const enrichedSchedule = scheduleData.map(entry => ({
                ...entry,
                asset_title: getAssetTitle(entry)
            }));

            setSchedule(enrichedSchedule);
        } catch (err) {
            console.error("Failed to fetch schedule:", err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const simulateDemoProgress = (initialSchedule: ScheduleEntry[]) => {
        let currentSchedule = [...initialSchedule];

        // Filter for Day 1 tasks that are NOT completed
        // If they are already completed in the global object (passed in via initialSchedule), we skip simulation
        const day1Indices = currentSchedule
            .map((t, i) => (t.scheduled_day === 1 && t.status !== 'completed' ? i : -1))
            .filter(i => i !== -1);

        if (day1Indices.length === 0) return;

        let taskIndex = 0; // Index within day1Indices

        const processNextTask = () => {
            if (taskIndex >= day1Indices.length) return;

            const realIndex = day1Indices[taskIndex];
            const task = currentSchedule[realIndex];
            const total = task.recipients_total || 1;

            // 1. Start Task
            currentSchedule[realIndex] = { ...task, status: 'in_progress', recipients_sent: 0 };
            setSchedule([...currentSchedule]);

            // 2. Animate Progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(total / 5); // 5 steps
                if (progress >= total) {
                    clearInterval(interval);

                    // 3. Complete Task
                    const completedTask = {
                        ...task,
                        status: 'completed',
                        recipients_sent: total,
                        completed_at: new Date().toISOString()
                    };
                    currentSchedule[realIndex] = completedTask;
                    setSchedule([...currentSchedule]);

                    // Update Global Demo Data (for navigation persistence)
                    if (DEMO_MODE_ENABLED()) {
                        const globalIndex = DEMO_CAMPAIGN.execution_schedule.findIndex(t => t.id === task.id);
                        if (globalIndex !== -1) {
                            DEMO_CAMPAIGN.execution_schedule[globalIndex] = completedTask as any;
                        }
                    }

                    // Move to next task after delay
                    taskIndex++;
                    setTimeout(processNextTask, 500);
                } else {
                    // Update Progress
                    const inProgressTask = {
                        ...task,
                        status: 'in_progress',
                        recipients_sent: progress
                    };
                    currentSchedule[realIndex] = inProgressTask;
                    setSchedule([...currentSchedule]);
                }
            }, 600); // Speed of progress bar
        };

        // Start the sequence
        setTimeout(processNextTask, 1000);
    };

    const getAssetTitle = (entry: ScheduleEntry) => {
        const day = entry.scheduled_day;
        switch (entry.channel) {
            case 'email': return day === 1 ? "Welcome Email" : day === 5 ? "Value Proposition" : day === 28 ? "Closing Email" : `Follow-up Email (Day ${day})`;
            case 'whatsapp': return day === 1 ? "Intro Message" : `Nurture Message (Day ${day})`;
            case 'instagram': return `Social Post #${Math.ceil(day / 3)} (Day ${day})`;
            default: return `${entry.channel} Content`;
        }
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'email': return <Mail className="w-4 h-4" />;
            case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
            case 'instagram': return <Instagram className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    // Fetch preview content for a scheduled item
    const handlePreview = async (item: ScheduleEntry) => {
        setPreviewItem(item);
        setLoadingPreview(true);

        if (DEMO_MODE_ENABLED()) {
            try {
                let content: any = null;
                if (item.asset_type === 'email_template') {
                    content = (DEMO_CAMPAIGN.email_templates as any[]).find(e => e.id === item.asset_id);
                    if (content) setPreviewContent(`**Subject:** ${content.subject}\n\n**Preview:** ${content.pre_header}\n\n${content.body}\n\n_CTA: ${content.cta_text}_`);
                } else if (item.asset_type === 'whatsapp_message') {
                    content = (DEMO_CAMPAIGN.whatsapp_messages as any[]).find(m => m.id === item.asset_id);
                    if (content) setPreviewContent(content.message_text);
                } else if (item.asset_type === 'social_post') {
                    content = (DEMO_CAMPAIGN.social_posts as any[]).find(p => p.id === item.asset_id);
                    if (content) setPreviewContent(`${content.caption}\n\n${content.hashtags || ''}`);
                }

                if (!content) setPreviewContent('Content not found in demo data.');
            } catch (e) {
                setPreviewContent('Failed to load demo preview.');
            } finally {
                setLoadingPreview(false);
            }
            return;
        }

        try {
            let table = '';
            if (item.asset_type === 'email_template') table = 'email_templates';
            else if (item.asset_type === 'whatsapp_message') table = 'whatsapp_messages';
            else if (item.asset_type === 'social_post') table = 'social_posts';

            if (!table) {
                setPreviewContent('Preview not available.');
                return;
            }

            const { data } = await supabase.from(table).select('*').eq('id', item.asset_id).single();
            if (data) {
                if (table === 'email_templates') {
                    setPreviewContent(`**Subject:** ${data.subject}\n\n**Preview:** ${data.pre_header}\n\n${data.body}\n\n_CTA: ${data.cta_text}_`);
                } else if (table === 'whatsapp_messages') {
                    setPreviewContent(data.message_text);
                } else if (table === 'social_posts') {
                    setPreviewContent(`${data.caption}\n\n${data.hashtags || ''}`);
                }
            } else {
                setPreviewContent('Content not found.');
            }
        } catch {
            setPreviewContent('Failed to load preview.');
        } finally {
            setLoadingPreview(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading timeline...</div>;

    const completed = schedule.filter(s => s.status === 'completed' || s.status === 'failed');
    const inProgress = schedule.filter(s => s.status === 'in_progress');
    const upcoming = schedule.filter(s => s.status === 'scheduled' || s.status === 'paused');

    // Calculate current day index relative to start
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = Math.min(Math.max(diffDays, 1), 28);

    // How many upcoming to show
    const visibleUpcoming = showAllUpcoming ? upcoming : upcoming.slice(0, 6);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 overflow-hidden relative">
            {/* Header / Progress Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${isPaused ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isPaused ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div>
                        <div className="text-white font-bold flex items-center gap-2">
                            {isPaused ? (
                                <>
                                    <span className="text-yellow-400">CAMPAIGN PAUSED</span>
                                    <span className="text-gray-500 font-normal">|</span> Day {currentDay} of 28
                                </>
                            ) : (
                                <>
                                    CAMPAIGN LIVE <span className="text-gray-500 font-normal">|</span> Day {currentDay} of 28
                                </>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            Started: {format(new Date(startDate), 'MMM d')} • Ends: {format(addDays(new Date(startDate), 28), 'MMM d')}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-white">
                        {schedule.length > 0 ? Math.round((completed.length / schedule.length) * 100) : 0}%
                    </span>
                    <span className="text-gray-500 text-xs block uppercase tracking-wide">Complete</span>
                </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-800 h-1.5 rounded-full mb-8 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isPaused ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${schedule.length > 0 ? (completed.length / schedule.length) * 100 : 0}%` }}
                ></div>
            </div>

            {/* COMPLETED SECTION */}
            {completed.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Completed
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                        {completed.map(item => (
                            <div
                                key={item.id}
                                className="min-w-[180px] bg-gray-950 border border-green-900/30 rounded-lg p-3 flex flex-col gap-2 hover:border-green-500/50 transition-colors cursor-pointer group"
                                onClick={() => handlePreview(item)}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] bg-green-900/20 text-green-400 px-1.5 py-0.5 rounded font-medium border border-green-900/30">Day {item.scheduled_day}</span>
                                    <span className="text-gray-500">{getChannelIcon(item.channel)}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-300 truncate" title={item.asset_title}>
                                    {item.asset_title}
                                </div>
                                <div className="text-[10px] text-gray-500 mt-auto pt-2 border-t border-gray-800/50 flex justify-between">
                                    <span>Success</span>
                                    <span className="text-green-400 font-mono">
                                        {item.channel === 'instagram' ? 'Posted' : `${item.recipients_sent}/${item.recipients_total}`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* IN PROGRESS SECTION */}
            {inProgress.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2 animate-pulse">
                        <PlayCircle className="w-4 h-4" /> Executing Now...
                    </h3>
                    <div className="space-y-4">
                        {inProgress.map(item => (
                            <div key={item.id} className="bg-indigo-900/10 border border-indigo-500/30 rounded-xl p-4 relative overflow-hidden">
                                {/* Background Pulse */}
                                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>

                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                                            {getChannelIcon(item.channel)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs bg-indigo-500 text-white px-1.5 rounded font-bold">Day {item.scheduled_day}</span>
                                                <h4 className="text-white font-bold">{item.asset_title}</h4>
                                            </div>
                                            <p className="text-xs text-indigo-300">
                                                {item.channel === 'instagram' ? 'Publishing post...' : `Sending to ${item.recipients_total} recipients...`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar within Card */}
                                    <div className="w-full md:w-64">
                                        <div className="flex justify-between text-xs text-indigo-300 mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round((item.recipients_sent / Math.max(item.recipients_total, 1)) * 100)}%</span>
                                        </div>
                                        <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-300 relative"
                                                style={{ width: `${(item.recipients_sent / Math.max(item.recipients_total, 1)) * 100}%` }}
                                            >
                                                <div className="absolute inset-0 bg-indigo-400/50 animate-pulse rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PAUSED NOTICE */}
            {isPaused && inProgress.length === 0 && (
                <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                    <PauseCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div>
                        <div className="text-yellow-300 font-medium text-sm">Campaign Paused</div>
                        <div className="text-yellow-200/60 text-xs">Scheduled tasks will not execute until you resume the campaign.</div>
                    </div>
                </div>
            )}

            {/* COMING UP */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Coming Up Next ({upcoming.length} tasks)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {visibleUpcoming.map(item => (
                        <div
                            key={item.id}
                            className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 opacity-70 hover:opacity-100 hover:border-gray-600 transition-all cursor-pointer group"
                            onClick={() => handlePreview(item)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] text-gray-400 font-mono">Day {item.scheduled_day}</span>
                                <span className="text-gray-500">{getChannelIcon(item.channel)}</span>
                            </div>
                            <div className="text-xs font-medium text-gray-300 mb-2 truncate">
                                {item.asset_title}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] text-gray-600">
                                    {format(new Date(item.scheduled_date), 'MMM d')}
                                </div>
                                <Eye className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
                {upcoming.length > 6 && (
                    <button
                        onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                        className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        {showAllUpcoming ? '▲ Show less' : `▼ Show all ${upcoming.length} upcoming tasks`}
                    </button>
                )}
            </div>

            {/* PREVIEW MODAL */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPreviewItem(null)}>
                    <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">{getChannelIcon(previewItem.channel)}</span>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{previewItem.asset_title}</h4>
                                    <span className="text-xs text-gray-500">Day {previewItem.scheduled_day} • {format(new Date(previewItem.scheduled_date), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                            <button onClick={() => setPreviewItem(null)} className="p-1 hover:bg-gray-800 rounded text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {loadingPreview ? (
                                <div className="text-gray-500 text-sm">Loading preview...</div>
                            ) : (
                                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: previewContent.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\n/g, '<br/>') }} />
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded ${previewItem.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                previewItem.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                    previewItem.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-gray-800 text-gray-500'
                                }`}>{previewItem.status === 'completed' ? '✓ Completed' : previewItem.status === 'in_progress' ? '⚡ In Progress' : previewItem.status === 'paused' ? '⏸ Paused' : '⏱ Scheduled'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
