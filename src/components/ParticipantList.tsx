import React from 'react';

interface ParticipantListProps {
    participants: string[];
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
    return (
        <div className="participant-list-card">
            <h3 className="text-lg font-bold mb-4 text-white">Participants ({participants.length})</h3>
            <div className="flex-col gap-2">
                {participants.map((name, i) => (
                    <div key={i} className="participant-item">
                        <div className="participant-avatar">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <span>{name}</span>
                    </div>
                ))}
                {participants.length === 0 && (
                    <p className="text-[var(--color-text-muted)]">No participants yet.</p>
                )}
            </div>
        </div>
    );
};

export default ParticipantList;
