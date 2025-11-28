import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, ArrowLeft } from 'lucide-react';

const EventCreated: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventUrl = `${window.location.origin}/event/${id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(eventUrl);
        // In a real app, show a toast notification here
        alert('Link copied to clipboard!');
    };

    return (
        <div className="max-w-2xl mx-auto text-center">
            <div className="glass-panel p-8 md:p-12 space-y-8">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Share2 size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Event Created!</h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Your event is ready. Share this QR code or link with your participants.
                    </p>
                </div>

                <div className="qr-code-container">
                    <QRCodeSVG value={eventUrl} size={200} />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                        Share Link
                    </label>
                    <div className="flex gap-2">
                        <input
                            readOnly
                            value={eventUrl}
                            className="input-field text-center font-mono text-sm"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
                            title="Copy Link"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                    <Link to="/" className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Create Another Event
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCreated;
