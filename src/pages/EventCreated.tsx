import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, ArrowLeft, Download } from 'lucide-react';
import { parseISO } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import Heatmap from '../components/Heatmap';
import ParticipantList from '../components/ParticipantList';
import ParticipantModal from '../components/ParticipantModal';
import { api } from '../utils/api';
import { getSocket, joinEventRoom, leaveEventRoom } from '../utils/socket';
import { downloadICS } from '../utils/icsGenerator';
import { addRecentEvent } from '../utils/recentEvents';

interface Participant {
    participantId: string;
    name: string;
    ipAddress?: string;
    joinedAt: string;
}

const EventCreated: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useLanguage();
    const eventUrl = `${window.location.origin}/event/${id}`;

    const [loading, setLoading] = useState(true);
    const [eventTitle, setEventTitle] = useState('');
    const [dates, setDates] = useState<Date[]>([]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [timezone, setTimezone] = useState('UTC');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [votes, setVotes] = useState<Record<string, number>>({});
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [isFinalized, setIsFinalized] = useState(false);
    const [finalizedTime, setFinalizedTime] = useState<string | null>(null);
    const [organizerName, setOrganizerName] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState<{ id: string; name: string } | null>(null);

    const dedupeParticipants = (participantList: Participant[]) => {
        const seen = new Set<string>();
        const unique: Participant[] = [];
        participantList.forEach(participant => {
            const key = `${participant.participantId}-${participant.name.trim().toLowerCase()}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(participant);
            }
        });
        return unique;
    };

    useEffect(() => {
        if (id) {
            loadEventData();

            // Join WebSocket room for this event
            joinEventRoom(id);
            const socket = getSocket();

            // Listen for participant updates
            socket.on('participant_joined', (data) => {
                console.log('Participant joined:', data);
                setParticipants(prev => dedupeParticipants([...prev, {
                    participantId: data.participantId,
                    name: data.name,
                    ipAddress: data.ipAddress,
                    joinedAt: data.joinedAt
                }]));
            });

            // Listen for vote updates
            socket.on('votes_updated', (data) => {
                console.log('Votes updated:', data);
                const voteCount: Record<string, number> = {};
                data.votes.forEach((vote: any) => {
                    voteCount[vote.timeSlot] = (voteCount[vote.timeSlot] || 0) + 1;
                });
                setVotes(voteCount);
            });

            // Listen for event finalization
            socket.on('event_finalized', (data) => {
                console.log('Event finalized:', data);
                setIsFinalized(true);
                setFinalizedTime(data.finalizedTime);
            });

            // Listen for user blocks
            socket.on('user_blocked', (data) => {
                console.log('User blocked:', data);
                setParticipants(prev => prev.filter(p => p.ipAddress !== data.ipAddress));
                // Reload votes to reflect the blocked user's votes being removed
                loadEventData();
            });

            return () => {
                socket.off('participant_joined');
                socket.off('votes_updated');
                socket.off('event_finalized');
                socket.off('user_blocked');
                leaveEventRoom(id);
            };
        }
    }, [id]);

    const loadEventData = async () => {
        try {
            const [event, participantsData, votesData] = await Promise.all([
                api.getEvent(id!),
                api.getParticipants(id!),
                api.getVotes(id!),
            ]);

            setEventTitle(event.title);
            setStartTime(event.startTime);
            setEndTime(event.endTime);
            setTimezone(event.timezone);
            setOrganizerName(event.organizerName);
            setIsFinalized(event.isFinalized);
            setFinalizedTime(event.finalizedTime);

            // Track recent event visit (always organizer on this page)
            addRecentEvent(event.eventId || id!, event.title, 'organizer');

            // Check if current user is the organizer
            const storedOrganizer = localStorage.getItem(`event_${id}_organizer`);
            if (storedOrganizer === event.organizerName) {
                setIsOrganizer(true);
            }

            if (event.type === 'dates' && event.selectedDates.length > 0) {
                setDates(event.selectedDates.map(d => parseISO(d)));
            } else if (event.type === 'days' && event.selectedDays.length > 0) {
                // For "days of week" events, generate the next 4 weeks of selected days
                const generatedDates: Date[] = [];
                const today = new Date();
                const weeksToShow = 4;

                for (let week = 0; week < weeksToShow; week++) {
                    event.selectedDays.forEach(dayOfWeek => {
                        const date = new Date(today);
                        const currentDay = date.getDay();
                        const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
                        date.setDate(date.getDate() + daysUntilTarget + (week * 7));
                        generatedDates.push(date);
                    });
                }

                // Sort dates chronologically
                generatedDates.sort((a, b) => a.getTime() - b.getTime());
                setDates(generatedDates);
            }

            setParticipants(dedupeParticipants(participantsData));

            const voteCount: Record<string, number> = {};
            votesData.forEach(vote => {
                voteCount[vote.timeSlot] = (voteCount[vote.timeSlot] || 0) + 1;
            });
            setVotes(voteCount);

            setLoading(false);
        } catch (error) {
            console.error('Failed to load event data:', error);
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(eventUrl);
        // In a real app, show a toast notification here
        // alert('Link copied to clipboard!');
    };

    const handleFinalize = (timeSlot: string) => {
        if (confirm(t.heatmap.finalizeConfirm.replace('{timeSlot}', timeSlot))) {
            api.finalizeEvent(id!, timeSlot)
                .then(() => {
                    setIsFinalized(true);
                    setFinalizedTime(timeSlot);
                    // alert('Event finalized successfully!');
                })
                .catch(error => {
                    console.error('Failed to finalize event:', error);
                    alert(t.errors.failedToFinalize);
                });
        }
    };

    const handleViewParticipant = (participantId: string, name: string) => {
        setSelectedParticipant({ id: participantId, name });
    };

    const handleBlockParticipant = (participantId: string, name: string) => {
        api.blockUser(id!, participantId)
            .then(() => {
                console.log(`User ${name} blocked successfully`);
                // The WebSocket will handle updating the UI
            })
            .catch(error => {
                console.error('Failed to block user:', error);
                alert('Failed to block user. Please try again.');
            });
    };

    const handleDownloadICS = () => {
        if (finalizedTime) {
            downloadICS(eventTitle, finalizedTime, timezone, organizerName);
        }
    };

    return (
        <div className="container pb-20 pt-8">
            <div className="max-w-6xl mx-auto">
                {/* QR Code Section */}
                <div className="glass-panel p-8 md:p-12 space-y-8 mb-8 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Share2 size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white">{t.eventCreated.title}</h1>
                        <p className="text-[var(--color-text-secondary)]">
                            {eventTitle ? t.eventCreated.subtitle.replace('{title}', eventTitle) : t.eventCreated.subtitleNoTitle}
                        </p>
                        {isOrganizer && organizerName && (
                            <p className="text-sm text-[var(--color-accent)] mt-2">
                                {t.eventCreated.organizedBy.replace('{name}', organizerName)}
                            </p>
                        )}
                    </div>

                    <div className="qr-code-container">
                        <QRCodeSVG value={eventUrl} size={200} />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                            {t.eventCreated.shareLink}
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
                            <ArrowLeft size={16} /> {t.eventCreated.createAnother}
                        </Link>
                    </div>
                </div>

                {/* Heatmap and Participants Section */}
                {!loading && dates.length > 0 && (
                    <div className="grid-cols-1 md:grid-cols-3 gap-8" style={{ display: 'grid' }}>
                        <div className="md:col-span-2">
                            <div className="card">
                                <div className="flex-between mb-6">
                                    <h2 className="text-xl font-bold text-white">{t.eventCreated.groupAvailability}</h2>
                                    {isOrganizer && !isFinalized && (
                                        <span className="text-sm text-[var(--color-accent)]">
                                            {t.eventCreated.organizerHint}
                                        </span>
                                    )}
                                    {isFinalized && finalizedTime && (
                                        <span className="text-sm text-green-400">
                                            {t.eventCreated.finalizedLabel.replace('{time}', finalizedTime)}
                                        </span>
                                    )}
                                </div>

                                {isFinalized && finalizedTime ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🎉</div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{t.eventCreated.finalizedTitle}</h3>
                                        <p className="text-lg text-[var(--color-text-secondary)] mb-4">
                                            {t.eventCreated.scheduledFor} <span className="text-[var(--color-accent)] font-bold">{finalizedTime}</span>
                                        </p>
                                        <p className="text-sm text-[var(--color-text-muted)] mb-6">
                                            {t.eventCreated.votingClosed}
                                        </p>
                                        <button
                                            onClick={handleDownloadICS}
                                            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                                        >
                                            <Download size={20} />
                                            {t.eventCreated.downloadICS}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Heatmap
                                            dates={dates}
                                            startTime={startTime}
                                            endTime={endTime}
                                            votes={votes}
                                            viewMode="aggregate"
                                            selectedSlots={finalizedTime ? [finalizedTime] : []}
                                            onSlotsChange={isOrganizer && !isFinalized ? (slots) => {
                                                const slotToFinalize = slots[slots.length - 1];
                                                if (slotToFinalize) {
                                                    handleFinalize(slotToFinalize);
                                                }
                                            } : () => { }}
                                            isFinalized={isFinalized}
                                            isOrganizerInAggregateMode={isOrganizer && !isFinalized}
                                        />
                                        <p className="text-[var(--color-text-muted)] text-sm mt-4 text-center">
                                            {isOrganizer && !isFinalized
                                                ? t.eventCreated.clickToFinalize
                                                : t.eventCreated.liveUpdates}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <ParticipantList
                                participants={participants}
                                organizerName={organizerName}
                                isOrganizer={isOrganizer}
                                onViewParticipant={handleViewParticipant}
                                onBlockParticipant={handleBlockParticipant}
                            />
                        </div>
                    </div>
                )}

                {/* Participant Modal */}
                {selectedParticipant && (
                    <ParticipantModal
                        eventId={id!}
                        participantId={selectedParticipant.id}
                        participantName={selectedParticipant.name}
                        dates={dates}
                        startTime={startTime}
                        endTime={endTime}
                        onClose={() => setSelectedParticipant(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default EventCreated;
