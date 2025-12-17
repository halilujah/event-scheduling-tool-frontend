import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Heatmap from '../components/Heatmap';
import ParticipantList from '../components/ParticipantList';
import { addDays, parseISO } from 'date-fns';
import clsx from 'clsx';
import { api } from '../utils/api';
import { getSocket, joinEventRoom, leaveEventRoom } from '../utils/socket';
import { downloadICS } from '../utils/icsGenerator';
import { Download } from 'lucide-react';

const EventVoting: React.FC = () => {
    const { eventId } = useParams();
    const [userName, setUserName] = useState('');
    const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'personal' | 'aggregate'>('personal');
    const [eventTitle, setEventTitle] = useState('');
    const [dates, setDates] = useState<Date[]>([]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [timezone, setTimezone] = useState('UTC');
    const [votes, setVotes] = useState<Record<string, number>>({});
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFinalized, setIsFinalized] = useState(false);
    const [finalizedTime, setFinalizedTime] = useState<string | null>(null);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [organizerName, setOrganizerName] = useState('');

    const dedupeNames = (names: string[]) => {
        const seen = new Set<string>();
        const unique: string[] = [];
        names.forEach(name => {
            const key = name.trim().toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(name);
            }
        });
        return unique;
    };

    useEffect(() => {
        if (eventId) {
            loadEventData();

            // Join WebSocket room for this event
            joinEventRoom(eventId);
            const socket = getSocket();

            // Listen for participant updates
            socket.on('participant_joined', (data) => {
                console.log('Participant joined:', data);
                setParticipants(prev => dedupeNames([...prev, data.name]));
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
                // Check if the current user was blocked
                const storedParticipant = localStorage.getItem(`event_${eventId}_participant`);
                if (storedParticipant) {
                    try {
                        const { participantId } = JSON.parse(storedParticipant);
                        if (participantId === data.participantId) {
                            // Current user was blocked
                            alert('You have been blocked from this event by the organizer.');
                            // Clear local storage
                            localStorage.removeItem(`event_${eventId}_participant`);
                            // Reload to show blocked state
                            window.location.reload();
                        }
                    } catch (e) {
                        console.error('Failed to parse stored participant:', e);
                    }
                }
                // Update participant list
                setParticipants(prev => prev.filter(name => name.toLowerCase() !== data.participantName.toLowerCase()));
            });

            return () => {
                socket.off('participant_joined');
                socket.off('votes_updated');
                socket.off('event_finalized');
                socket.off('user_blocked');
                leaveEventRoom(eventId);
            };
        }
    }, [eventId]);

    const loadEventData = async () => {
        try {
            const [event, participantsData, votesData] = await Promise.all([
                api.getEvent(eventId!),
                api.getParticipants(eventId!),
                api.getVotes(eventId!),
            ]);

            setEventTitle(event.title);
            setStartTime(event.startTime);
            setEndTime(event.endTime);
            setTimezone(event.timezone);
            setIsFinalized(event.isFinalized);
            setFinalizedTime(event.finalizedTime);
            setOrganizerName(event.organizerName);

            if (event.type === 'dates' && event.selectedDates.length > 0) {
                setDates(event.selectedDates.map(d => parseISO(d)));
            } else {
                setDates([new Date(), addDays(new Date(), 1), addDays(new Date(), 2)]);
            }

            const uniqueParticipants = dedupeNames(participantsData.map(p => p.name));
            setParticipants(uniqueParticipants);

            const voteCount: Record<string, number> = {};
            votesData.forEach(vote => {
                voteCount[vote.timeSlot] = (voteCount[vote.timeSlot] || 0) + 1;
            });
            setVotes(voteCount);

            // Check if current user is the organizer
            const storedOrganizer = localStorage.getItem(`event_${eventId}_organizer`);

            if (storedOrganizer === event.organizerName) {
                setIsOrganizer(true);

                // Check if organizer has already joined as a participant
                const storedParticipant = localStorage.getItem(`event_${eventId}_participant`);
                if (storedParticipant) {
                    try {
                        const { participantId } = JSON.parse(storedParticipant);
                        const participantExists = participantsData.some(p => p.participantId === participantId);
                        if (participantExists) {
                            setCurrentParticipantId(participantId);
                            // Load their existing votes
                            const userVotes = votesData
                                .filter(vote => vote.participantId === participantId)
                                .map(vote => vote.timeSlot);
                            setSelectedSlots(userVotes);
                        }
                    } catch (e) {
                        console.error('Failed to parse stored participant:', e);
                    }
                } else {
                    // Auto-join organizer as participant
                    try {
                        const response = await api.addParticipant(eventId!, storedOrganizer!);
                        setCurrentParticipantId(response.participantId);
                        const updatedParticipants = dedupeNames([...participantsData.map(p => p.name), storedOrganizer!]);
                        setParticipants(updatedParticipants);

                        // Store participant identity for this event
                        localStorage.setItem(`event_${eventId}_participant`, JSON.stringify({
                            participantId: response.participantId,
                            name: storedOrganizer!
                        }));

                        // Store name globally for future events
                        localStorage.setItem('user_display_name', storedOrganizer!);
                    } catch (error) {
                        console.error('Failed to auto-join organizer:', error);
                    }
                }
            } else {
                // Check if user has already joined this specific event
                const storedParticipant = localStorage.getItem(`event_${eventId}_participant`);
                if (storedParticipant) {
                    try {
                        const { participantId, name } = JSON.parse(storedParticipant);
                        // Verify participant still exists in the database
                        const participantExists = participantsData.some(p => p.participantId === participantId);
                        if (participantExists) {
                            setCurrentParticipantId(participantId);
                            // Load their existing votes
                            const userVotes = votesData
                                .filter(vote => vote.participantId === participantId)
                                .map(vote => vote.timeSlot);
                            setSelectedSlots(userVotes);
                            console.log(`Restored session for ${name}`);
                        } else {
                            // Participant no longer exists (blocked or deleted), clear localStorage
                            localStorage.removeItem(`event_${eventId}_participant`);
                        }
                    } catch (e) {
                        console.error('Failed to parse stored participant:', e);
                    }
                } else {
                    // User hasn't joined THIS event yet
                    // Check if they have a saved name from another event
                    const savedName = localStorage.getItem('user_display_name');
                    if (savedName && savedName.trim()) {
                        // Auto-join with saved name
                        try {
                            const response = await api.addParticipant(eventId!, savedName);
                            setCurrentParticipantId(response.participantId);
                            const updatedParticipants = dedupeNames([...participantsData.map(p => p.name), savedName]);
                            setParticipants(updatedParticipants);

                            // Store participant identity for this event
                            localStorage.setItem(`event_${eventId}_participant`, JSON.stringify({
                                participantId: response.participantId,
                                name: savedName
                            }));

                            console.log(`Auto-joined as ${savedName}`);
                        } catch (error: any) {
                            console.error('Failed to auto-join with saved name:', error);
                            // If auto-join fails (e.g., blocked), prefill the name for manual join
                            if (error.message && error.message.includes('blocked')) {
                                alert('You have been blocked from this event.');
                            } else {
                                setUserName(savedName); // Prefill for manual join
                            }
                        }
                    }
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Failed to load event data:', error);
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (userName.trim() && eventId) {
            try {
                const response = await api.addParticipant(eventId!, userName);
                setCurrentParticipantId(response.participantId);
                setParticipants(prev => dedupeNames([...prev, userName]));

                // Store user identity for this specific event
                localStorage.setItem(`event_${eventId}_participant`, JSON.stringify({
                    participantId: response.participantId,
                    name: userName
                }));

                // Store name globally for auto-join in future events
                localStorage.setItem('user_display_name', userName);

                setUserName('');
            } catch (error: any) {
                console.error('Failed to join event:', error);
                // Check if user is blocked (403 error)
                if (error.message && error.message.includes('blocked')) {
                    alert('You have been blocked from this event by the organizer.');
                } else {
                    alert('Failed to join event. Please try again.');
                }
            }
        }
    };

    const handleFinalize = (timeSlot: string) => {
        if (confirm(`Finalize this event for ${timeSlot}? Participants will no longer be able to vote.`)) {
            api.finalizeEvent(eventId!, timeSlot)
                .then(() => {
                    setIsFinalized(true);
                    setFinalizedTime(timeSlot);
                    // alert('Event finalized successfully!');
                })
                .catch(error => {
                    console.error('Failed to finalize event:', error);
                    alert('Failed to finalize event. Please try again.');
                });
        }
    };

    const handleDownloadICS = () => {
        if (finalizedTime) {
            downloadICS(eventTitle, finalizedTime, timezone, organizerName);
        }
    };

    // Auto-save votes when selection changes
    useEffect(() => {
        const autoSaveVotes = async () => {
            if (!currentParticipantId || !eventId || selectedSlots.length === 0) {
                return;
            }

            try {
                await api.submitVotes(eventId, currentParticipantId, selectedSlots);
                console.log('Votes auto-saved');
            } catch (error) {
                console.error('Failed to auto-save votes:', error);
            }
        };

        // Debounce auto-save to avoid too many requests
        const timeoutId = setTimeout(autoSaveVotes, 500);
        return () => clearTimeout(timeoutId);
    }, [selectedSlots, currentParticipantId, eventId]);

    const heatmapSelectedSlots = finalizedTime
        ? [finalizedTime]
        : (isOrganizer && viewMode === 'aggregate' ? [] : selectedSlots);

    if (loading) {
        return (
            <div className="container pb-20 pt-8">
                <div className="flex-center">
                    <p className="text-white">Loading event...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container pb-20 pt-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{eventTitle}</h1>
                <p className="text-[var(--color-text-muted)]">Event ID: {eventId}</p>
                {isFinalized && finalizedTime ? (
                    <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                        <p className="text-green-400 font-bold flex items-center gap-2">
                            <span className="text-2xl">🎉</span>
                            Event Finalized! Scheduled for: {finalizedTime}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-2 mb-3">
                            Voting is now closed
                        </p>
                        <button
                            onClick={handleDownloadICS}
                            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                            <Download size={16} />
                            Download Calendar Event (.ics)
                        </button>
                    </div>
                ) : (
                    <p className="text-[var(--color-text-secondary)] mt-2">
                        Please select all times you are available.
                    </p>
                )}
            </div>

            <div className="grid-cols-1 md:grid-cols-3 gap-8" style={{ display: 'grid' }}>
                <div className="md:col-span-2">
                    <div className="card mb-8" style={{ minWidth: 0 }}>
                        <div className="flex-between mb-6">
                            <h2 className="text-xl font-bold text-white">Availability</h2>

                            {/* View Mode Toggle */}
                            <div className="tabs mb-0" style={{ width: 'auto', minWidth: '300px' }}>
                                <div
                                    onClick={() => setViewMode('personal')}
                                    className={clsx("tab-btn", viewMode === 'personal' && "active")}
                                >
                                    My Vote
                                </div>
                                <div
                                    onClick={() => setViewMode('aggregate')}
                                    className={clsx("tab-btn", viewMode === 'aggregate' && "active")}
                                >
                                    Group View {isOrganizer && !isFinalized && '(Click to Finalize)'}
                                </div>
                            </div>
                        </div>

                        <Heatmap
                            dates={dates}
                            startTime={startTime}
                            endTime={endTime}
                            votes={votes}
                            viewMode={isFinalized ? 'aggregate' : viewMode}
                            selectedSlots={heatmapSelectedSlots}
                            onSlotsChange={isOrganizer && !isFinalized && viewMode === 'aggregate' ? (slots) => {
                                const slotToFinalize = slots[slots.length - 1];
                                if (slotToFinalize) {
                                    handleFinalize(slotToFinalize);
                                }
                            } : (isFinalized ? () => { } : setSelectedSlots)}
                            isFinalized={isFinalized}
                            isOrganizerInAggregateMode={isOrganizer && viewMode === 'aggregate' && !isFinalized}
                        />

                        {viewMode === 'personal' && currentParticipantId && !isFinalized && (
                            <p className="text-[var(--color-text-muted)] text-sm mt-4 text-center">
                                ✓ Your changes are saved automatically
                            </p>
                        )}
                        {isOrganizer && !isFinalized && viewMode === 'aggregate' && (
                            <p className="text-[var(--color-text-muted)] text-sm mt-4 text-center">
                                💡 Click on a time slot to finalize the event
                            </p>
                        )}
                        {isFinalized && (
                            <p className="text-[var(--color-text-muted)] text-sm mt-4 text-center">
                                🔒 Voting is locked - Event has been finalized
                            </p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="card mb-8">
                        <h3 className="text-lg font-bold mb-4 text-white">
                            {currentParticipantId ? 'Your Status' : 'Join Event'}
                        </h3>
                        {currentParticipantId ? (
                            <div className="space-y-2">
                                <p className="text-[var(--color-text-secondary)] text-sm">
                                    You're participating as:
                                </p>
                                <p className="text-white font-medium">
                                    {isOrganizer ? (
                                        <>
                                            {organizerName} <span className="text-[var(--color-accent)]">(Organizer)</span>
                                        </>
                                    ) : (
                                        (() => {
                                            const stored = localStorage.getItem(`event_${eventId}_participant`);
                                            if (stored) {
                                                return JSON.parse(stored).name;
                                            }
                                            return 'Unknown';
                                        })()
                                    )}
                                </p>
                                <p className="text-[var(--color-text-muted)] text-xs">
                                    ✓ Your identity is saved for this event
                                </p>
                            </div>
                        ) : (
                            <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                                <input
                                    type="text"
                                    className="input-field flex-1"
                                    placeholder="Your Name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                />
                                <button
                                    onClick={handleJoin}
                                    className="btn-primary"
                                >
                                    Join
                                </button>
                            </div>
                        )}
                    </div>

                    <ParticipantList participants={participants} organizerName={organizerName} />
                </div>
            </div>
        </div>
    );
};

export default EventVoting;
