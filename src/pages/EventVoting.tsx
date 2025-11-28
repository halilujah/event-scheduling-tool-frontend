import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Heatmap from '../components/Heatmap';
import ParticipantList from '../components/ParticipantList';
import { addDays, format } from 'date-fns';
import clsx from 'clsx';

const EventVoting: React.FC = () => {
    const { eventId } = useParams();
    const [userName, setUserName] = useState('');
    const [participants, setParticipants] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'David']);
    const [viewMode, setViewMode] = useState<'personal' | 'aggregate'>('personal');

    // Mock data
    const dates = [new Date(), addDays(new Date(), 1), addDays(new Date(), 2)];
    const startTime = "09:00";
    const endTime = "17:00";

    // Mock votes: "YYYY-MM-DD HH:mm" -> count
    // Generate some random votes for demo
    const generateMockVotes = () => {
        const v: Record<string, number> = {};
        dates.forEach(d => {
            for (let h = 9; h < 17; h++) {
                const key = `${format(d, 'yyyy-MM-dd')} ${h.toString().padStart(2, '0')}:00`;
                const key30 = `${format(d, 'yyyy-MM-dd')} ${h.toString().padStart(2, '0')}:30`;
                if (Math.random() > 0.5) v[key] = Math.floor(Math.random() * 5);
                if (Math.random() > 0.5) v[key30] = Math.floor(Math.random() * 5);
            }
        });
        return v;
    };

    const [votes] = useState(generateMockVotes());

    const handleJoin = () => {
        if (userName.trim()) {
            setParticipants([...participants, userName]);
            setUserName('');
        }
    };

    return (
        <div className="container pb-20 pt-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Team Sync</h1>
                <p className="text-[var(--color-text-muted)]">Event ID: {eventId}</p>
                <p className="text-[var(--color-text-secondary)] mt-2">
                    Please select all times you are available.
                </p>
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
                                    Group View
                                </div>
                            </div>
                        </div>

                        <Heatmap
                            dates={dates}
                            startTime={startTime}
                            endTime={endTime}
                            votes={votes}
                            viewMode={viewMode}
                        />
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="card mb-8">
                        <h3 className="text-lg font-bold mb-4 text-white">Join Event</h3>
                        <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                            <input
                                type="text"
                                className="input-field flex-1"
                                placeholder="Your Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <button
                                onClick={handleJoin}
                                className="btn-primary"
                            >
                                Join
                            </button>
                        </div>
                    </div>

                    <ParticipantList participants={participants} />
                </div>
            </div>
        </div>
    );
};

export default EventVoting;
