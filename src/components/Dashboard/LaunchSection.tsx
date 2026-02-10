import React, { useState } from 'react';
import { Rocket, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateExecutionSchedule, triggerWebhook } from '../../services/executionService';

interface LaunchSectionProps {
    campaignId: string;
    recipientCount: number;
    recommendedChannels: string[];
    onLaunchComplete: () => void;
}

export const LaunchSection: React.FC<LaunchSectionProps> = ({
    campaignId,
    recipientCount,
    recommendedChannels,
    onLaunchComplete
}) => {
    const [isLaunching, setIsLaunching] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLaunch = async () => {
        setIsLaunching(true);
        setError(null);
        try {
            // 1. Generate Schedule
            await generateExecutionSchedule(campaignId);

            // 2. Trigger Webhook (Launch Notification)
            await triggerWebhook('campaign_launched', {
                campaign_id: campaignId,
                action: 'campaign_launched',
                start_date: new Date().toISOString()
            });

            // 3. Callback to refresh parent state
            onLaunchComplete();
            setShowConfirm(false);
        } catch (err: any) {
            console.error("Launch failed:", err);
            setError(err.message || 'Failed to launch campaign');
        } finally {
            setIsLaunching(false);
        }
    };

    if (!showConfirm) {
        return (
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl p-8 mb-8 text-center relative overflow-hidden group">
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/20 transition-all duration-700"></div>

                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-full mb-6 ring-1 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <Rocket className="w-8 h-8 text-indigo-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Your Campaign is Ready to Launch 🚀</h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
                    Launch a 28-day automated marketing campaign across <span className="text-white font-medium">{recommendedChannels.length} channels</span> to <span className="text-white font-medium">{recipientCount} recipients</span>.
                    MiCA will handle everything automatically.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
                    <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20 backdrop-blur-sm">
                        <div className="text-indigo-400 font-bold text-lg mb-1">5 Emails</div>
                        <div className="text-gray-400 text-sm">Scheduled across 28 days</div>
                    </div>
                    {(recommendedChannels.includes('whatsapp')) && (
                        <div className="bg-black/30 p-4 rounded-lg border border-green-500/20 backdrop-blur-sm">
                            <div className="text-green-400 font-bold text-lg mb-1">8 WhatsApp Msgs</div>
                            <div className="text-gray-400 text-sm">Personalized & Automated</div>
                        </div>
                    )}
                    {(recommendedChannels.includes('instagram')) && (
                        <div className="bg-black/30 p-4 rounded-lg border border-pink-500/20 backdrop-blur-sm">
                            <div className="text-pink-400 font-bold text-lg mb-1">10 Posts</div>
                            <div className="text-gray-400 text-sm">Auto-published to Instagram</div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <Button
                        onClick={() => setShowConfirm(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 text-lg rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all duration-300 font-bold flex items-center gap-3"
                    >
                        <Rocket className="w-5 h-5" /> LAUNCH CAMPAIGN NOW
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    By launching, you agree to send automated messages. Campaign runs for 28 days.
                </p>
            </div>
        );
    }

    // Confirmation Modal
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-full flex-shrink-0">
                            <Rocket className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirm Campaign Launch?</h3>
                            <p className="text-gray-400 leading-relaxed">
                                This will immediately start the 28-day automation. Messages will be sent to <strong>{recipientCount} recipients</strong> according to the schedule.
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 flex gap-3 text-sm text-yellow-200">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <div>
                            Once launched, the schedule is locked. You can pause the campaign, but you cannot undo sent messages.
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirm(false)}
                            disabled={isLaunching}
                            className="text-gray-400 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLaunch}
                            disabled={isLaunching}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[160px] relative overflow-hidden"
                        >
                            {isLaunching ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Launching...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    🚀 Yes, Launch It
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
