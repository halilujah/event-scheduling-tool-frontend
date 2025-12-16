import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

interface Participant {
    participantId: string;
    name: string;
    ipAddress?: string;
}

interface ParticipantListProps {
    participants: Participant[] | string[];
    organizerName?: string;
    isOrganizer?: boolean;
    onViewParticipant?: (participantId: string, name: string) => void;
    onBlockParticipant?: (participantId: string, name: string) => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
    participants,
    organizerName,
    isOrganizer = false,
    onViewParticipant,
    onBlockParticipant
}) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const normalize = (name: string) => name.trim().toLowerCase();

    const handleViewClick = (participantId: string, name: string) => {
        if (onViewParticipant) {
            onViewParticipant(participantId, name);
        }
        setOpenMenuId(null);
    };

    const handleBlockClick = (participantId: string, name: string) => {
        if (onBlockParticipant && confirm(`Are you sure you want to block ${name}? They will be removed from this event and cannot rejoin.`)) {
            onBlockParticipant(participantId, name);
        }
        setOpenMenuId(null);
    };

    // Normalize participants to always work with objects
    const normalizedParticipants: Participant[] = participants.map((p, idx) => {
        if (typeof p === 'string') {
            return { participantId: `temp-${idx}`, name: p };
        }
        return p;
    });

    return (
        <div className="participant-list-card">
            <h3 className="text-lg font-bold mb-4 text-white">Participants ({participants.length})</h3>
            <div className="flex-col gap-2">
                {normalizedParticipants.map((participant) => {
                    const isOrganizerUser = organizerName && normalize(participant.name) === normalize(organizerName);
                    const isMenuOpen = openMenuId === participant.participantId;
                    const isRealParticipant = !participant.participantId.startsWith('temp-');

                    return (
                        <div key={participant.participantId} className="participant-item group">
                            <div
                                className="flex items-center gap-2 flex-1 cursor-pointer"
                                onClick={() => isOrganizer && isRealParticipant && onViewParticipant && handleViewClick(participant.participantId, participant.name)}
                            >
                                <div className="participant-avatar">
                                    {participant.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="flex-1">{participant.name}{isOrganizerUser ? ' (Organizer)' : ''}</span>
                            </div>

                            {isOrganizer && !isOrganizerUser && isRealParticipant && (
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(isMenuOpen ? null : participant.participantId);
                                        }}
                                        className="p-1 text-[var(--color-text-secondary)] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                        title="More options"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {isMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setOpenMenuId(null)}
                                            />
                                            <div className="absolute right-0 top-8 bg-[var(--color-bg-primary)] border border-white/10 rounded-lg shadow-lg z-20 min-w-[150px]">
                                                <button
                                                    onClick={() => handleViewClick(participant.participantId, participant.name)}
                                                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                                                >
                                                    View Availability
                                                </button>
                                                <button
                                                    onClick={() => handleBlockClick(participant.participantId, participant.name)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                                                >
                                                    Block User
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                {participants.length === 0 && (
                    <p className="text-[var(--color-text-muted)]">No participants yet.</p>
                )}
            </div>
        </div>
    );
};

export default ParticipantList;
