import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { DEMO_MODE_ENABLED } from '../data/demoData';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DemoPrep: React.FC = () => {
    const navigate = useNavigate();
    const [checks, setChecks] = useState([
        { id: 1, label: "Demo Mode Active", status: "pending", description: "Toggle is green and banner is visible" },
        { id: 2, label: "Campaign List Data", status: "pending", description: "Shows '7-Day Mindfulness Challenge' without loading" },
        { id: 3, label: "Tone Preview", status: "pending", description: "Shows 'Warm & Inspirational' tone with 3 samples" },
        { id: 4, label: "Video Fallback", status: "pending", description: "Video player loads fallback intro video" },
        { id: 5, label: "Generation Simulation", status: "pending", description: "Simulates generation steps with ~1s delay per step" },
        { id: 6, label: "Dashboard Data", status: "pending", description: "All tabs (Emails, WhatsApp, Instagram) populated" },
        { id: 7, label: "Execution Timeline", status: "pending", description: "Shows historical and upcoming tasks" }
    ]);

    useEffect(() => {
        // Auto-check demo mode
        if (DEMO_MODE_ENABLED()) {
            toggleCheck(1, 'pass');
        } else {
            toggleCheck(1, 'fail');
        }
    }, []);

    const toggleCheck = (id: number, status?: 'pass' | 'fail' | 'pending') => {
        setChecks(prev => prev.map(c => {
            if (c.id !== id) return c;
            const nextStatus = status ? status : c.status === 'pending' ? 'pass' : c.status === 'pass' ? 'fail' : 'pending';
            return { ...c, status: nextStatus };
        }));
    };

    const getStatusIcon = (status: string) => {
        if (status === 'pass') return <CheckCircle2 className="w-6 h-6 text-green-500" />;
        if (status === 'fail') return <AlertCircle className="w-6 h-6 text-red-500" />;
        return <Circle className="w-6 h-6 text-gray-600" />;
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Demo Day Readiness Checklist</h1>
                    <p className="text-gray-400">Verify all systems are go for the presentation.</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8">
                    {checks.map((check) => (
                        <div
                            key={check.id}
                            className="p-6 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors flex items-center gap-4 cursor-pointer"
                            onClick={() => toggleCheck(check.id)}
                        >
                            <div className="flex-shrink-0">
                                {getStatusIcon(check.status)}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold text-lg ${check.status === 'pass' ? 'text-green-400' : 'text-white'}`}>
                                    {check.label}
                                </h3>
                                <p className="text-sm text-gray-500">{check.description}</p>
                            </div>
                            <div className="text-xs text-gray-600 uppercase font-mono tracking-wider">
                                {check.status}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div>
                        <h3 className="text-white font-medium mb-1">Quick Links</h3>
                        <p className="text-gray-500 text-sm">Jump to key pages to verify.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => navigate('/')}>Campaign List</Button>
                        <Button onClick={() => navigate('/create-campaign')}>Start Flow</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
