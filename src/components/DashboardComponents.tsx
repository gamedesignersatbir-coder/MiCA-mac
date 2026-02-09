import React from 'react';
import { Download, Play, Pause, RefreshCw } from 'lucide-react';

// Video Player Component
interface VideoPlayerProps {
    videoUrl?: string; // If connected to real data
    posterUrl?: string;
    isGenerating?: boolean;
    onRetry?: () => void;
    className?: string;
    description?: string;
    script?: string;
    showScript?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    posterUrl,
    isGenerating,
    onRetry,
    className,
    description,
    script,
    showScript = false
}) => {
    const [isPlaying, setIsPlaying] = React.useState(true); // Generated video auto-plays
    const [isMuted, setIsMuted] = React.useState(false); // Default unmuted for dashboard
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (isGenerating) {
        return (
            <div className={`aspect-[9/16] bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-6 border border-gray-800 ${className}`}>
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4" />
                <h3 className="text-white font-medium mb-2">Generating Video...</h3>
                <p className="text-gray-500 text-sm text-center">This usually takes 2-5 minutes.</p>
                {onRetry && (
                    <button onClick={onRetry} className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Check Status
                    </button>
                )}
            </div>
        );
    }

    if (!videoUrl) {
        return (
            <div className={`aspect-[9/16] bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-6 border border-gray-800 ${className}`}>
                <p className="text-gray-500">Video unavailable</p>
                {onRetry && <button onClick={onRetry} className="mt-2 text-indigo-400 text-sm">Retry</button>}
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="relative rounded-2xl overflow-hidden group shadow-2xl bg-black aspect-[9/16]">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={posterUrl}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    autoPlay
                    muted={isMuted} // Controlled by state
                    // Default to unmuted is tricky in browsers without interaction, but we try
                    onEnded={() => setIsPlaying(false)}
                />

                {/* Controls overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                        onClick={togglePlay}
                        className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                    </button>
                </div>

                <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 bg-black/50 rounded-full text-white text-xs backdrop-blur-md"
                    >
                        {isMuted ? "🔇" : "🔊"}
                    </button>
                </div>
            </div>

            {/* Description / Script */}
            {(description || (showScript && script)) && (
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    {description && <p className="text-gray-400 text-sm mb-2">{description}</p>}
                    {showScript && script && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Video Script</h4>
                            <p className="text-gray-300 text-sm italic leading-relaxed">"{script}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Social Post Card with Image
interface SocialPostCardProps {
    post: any;
    onGenerateImage?: (postId: string, prompt: string) => void;
    generatingImageId?: string | null;
}

export const SocialPostCard: React.FC<SocialPostCardProps> = ({ post, onGenerateImage, generatingImageId }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
            {/* Image Area */}
            <div className="aspect-square bg-gray-950 relative group">
                {post.image_url ? (
                    <>
                        <img src={post.image_url} alt="Social post" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a
                                href={post.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100"
                            >
                                <Download className="w-4 h-4" /> Download
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="border-2 border-dashed border-gray-800 rounded-xl inset-4 absolute" />
                        <p className="text-xs text-gray-500 italic relative z-10 mb-4 px-4">{post.image_suggestion || "No image suggestion"}</p>

                        {onGenerateImage && (
                            <button
                                onClick={() => onGenerateImage(post.id, post.image_suggestion)}
                                disabled={generatingImageId === post.id}
                                className="relative z-10 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {generatingImageId === post.id ? (
                                    <><RefreshCw className="w-3 h-3 animate-spin" /> Generating...</>
                                ) : (
                                    'Generate Image'
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Day Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
                    Day {post.scheduled_day}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
                <p className="text-sm text-gray-300 line-clamp-3 mb-3 group-hover:line-clamp-none transition-all">
                    {post.caption}
                </p>
                <div className="flex flex-wrap gap-1">
                    {post.hashtags && post.hashtags.split(' ').map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] text-blue-400">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
