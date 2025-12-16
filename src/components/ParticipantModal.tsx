import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Heatmap from './Heatmap';
import { api } from '../utils/api';

interface ParticipantModalProps {
    eventId: string;
    participantId: string;
    participantName: string;
    dates: Date[];
    startTime: string;
    endTime: string;
    onClose: () => void;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({
    eventId,
    participantId,
    participantName,
    dates,
    startTime,
    endTime,
    onClose
}) => {
    const [loading, setLoading] = useState(true);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    useEffect(() => {
        loadParticipantVotes();
    }, [eventId, participantId]);

    const loadParticipantVotes = async () => {
        try {
            const data = await api.getParticipantVotes(eventId, participantId);
            setSelectedSlots(data.timeSlots);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load participant votes:', error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[var(--color-bg-secondary)] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-[var(--color-bg-secondary)] border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                        {participantName}'s Availability
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
                        title="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-[var(--color-text-secondary)]">Loading availability...</p>
                        </div>
                    ) : selectedSlots.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[var(--color-text-secondary)]">
                                {participantName} hasn't selected any time slots yet.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-[var(--color-text-secondary)] mb-6">
                                Green cells indicate times when {participantName} is available.
                            </p>
                            <Heatmap
                                dates={dates}
                                startTime={startTime}
                                endTime={endTime}
                                votes={{}}
                                viewMode="personal"
                                selectedSlots={selectedSlots}
                                onSlotsChange={() => {}}
                                isFinalized={false}
                                isOrganizerInAggregateMode={false}
                            />
                            <div className="mt-6 p-4 bg-[var(--color-bg-primary)] rounded-lg">
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    <strong className="text-white">{selectedSlots.length}</strong> time slot(s) selected
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantModal;
