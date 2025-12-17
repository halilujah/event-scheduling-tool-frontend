import React from 'react';
import { UserX, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
    const { t } = useLanguage();
    const normalize = (name: string) => name.trim().toLowerCase();

    const handleViewClick = (e: React.MouseEvent, participantId: string, name: string) => {
        e.stopPropagation();
        if (onViewParticipant) {
            onViewParticipant(participantId, name);
        }
    };

    const handleBlockClick = (e: React.MouseEvent, participantId: string, name: string) => {
        e.stopPropagation();
        if (onBlockParticipant && confirm(t.participantList.blockConfirm.replace('{name}', name))) {
            onBlockParticipant(participantId, name);
        }
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
            <h3 className="text-lg font-bold mb-4 text-white">{t.eventVoting.participants} ({participants.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {normalizedParticipants.map((participant) => {
                    const isOrganizerUser = organizerName && normalize(participant.name) === normalize(organizerName);
                    const isRealParticipant = !participant.participantId.startsWith('temp-');

                    return (
                        <div key={participant.participantId} className="participant-item group">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                                <div className="participant-avatar">
                                    {participant.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {participant.name}{isOrganizerUser ? ` ${t.eventVoting.organizer}` : ''}
                                </span>
                            </div>

                            {isOrganizer && !isOrganizerUser && isRealParticipant && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleViewClick(e, participant.participantId, participant.name)}
                                        className="p-1.5 text-[var(--color-text-secondary)] hover:text-blue-400 transition-colors rounded"
                                        title={t.participantList.viewAvailability}
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => handleBlockClick(e, participant.participantId, participant.name)}
                                        className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-400 transition-colors rounded"
                                        title={t.participantList.blockUser}
                                    >
                                        <UserX size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {participants.length === 0 && (
                    <p className="text-[var(--color-text-muted)]">{t.eventVoting.noParticipants}</p>
                )}
            </div>
        </div>
    );
};

export default ParticipantList;
