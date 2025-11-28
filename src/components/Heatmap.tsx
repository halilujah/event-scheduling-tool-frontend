import React, { useState } from 'react';
import clsx from 'clsx';
import { format, addMinutes } from 'date-fns';

interface HeatmapProps {
    dates: Date[];
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    votes?: Record<string, number>; // "YYYY-MM-DD HH:mm" -> count
    viewMode: 'personal' | 'aggregate';
}

const Heatmap: React.FC<HeatmapProps> = ({ dates, startTime, endTime, votes = {}, viewMode }) => {
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    // Generate time slots
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const slots: string[] = [];

    let current = new Date();
    current.setHours(startHour, 0, 0, 0);
    const end = new Date();
    end.setHours(endHour, 0, 0, 0);

    while (current < end) {
        slots.push(format(current, 'HH:mm'));
        current = addMinutes(current, 30); // 30 min intervals
    }

    const toggleSlot = (date: Date, time: string) => {
        if (viewMode === 'aggregate') return; // Read-only in aggregate mode

        const key = `${format(date, 'yyyy-MM-dd')} ${time}`;
        setSelectedSlots(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const getOpacity = (count: number) => {
        if (count === 0) return 0.05; // Very faint for 0 votes
        const max = Math.max(...Object.values(votes), 1);
        return 0.2 + (count / max) * 0.8;
    };

    return (
        <div className="heatmap-container">
            <div className="heatmap-grid" style={{
                gridTemplateColumns: `auto repeat(${dates.length}, minmax(80px, 1fr))`,
            }}>
                {/* Header Row (Dates) */}
                <div className="p-2"></div>
                {dates.map((date, i) => (
                    <div key={i} className="heatmap-header-cell">
                        {format(date, 'EEE d')}
                    </div>
                ))}

                {/* Time Rows */}
                {slots.map((time) => (
                    <React.Fragment key={time}>
                        <div className="heatmap-time-label">
                            {time}
                        </div>
                        {dates.map((date, i) => {
                            const key = `${format(date, 'yyyy-MM-dd')} ${time}`;
                            const isSelected = selectedSlots.includes(key);
                            const voteCount = votes[key] || 0;

                            let backgroundColor;
                            let borderColor = 'var(--color-border)';

                            if (viewMode === 'personal') {
                                if (isSelected) {
                                    backgroundColor = 'var(--color-accent)';
                                    borderColor = 'var(--color-accent)';
                                } else {
                                    backgroundColor = 'var(--color-bg-tertiary)';
                                }
                            } else {
                                // Aggregate mode
                                backgroundColor = `rgba(139, 92, 246, ${getOpacity(voteCount)})`;
                                if (voteCount > 0) borderColor = 'rgba(139, 92, 246, 0.5)';
                            }

                            return (
                                <div
                                    key={i}
                                    onClick={() => toggleSlot(date, time)}
                                    className={clsx(
                                        "heatmap-cell",
                                        viewMode === 'personal' && isSelected && "selected",
                                        viewMode === 'aggregate' && "cursor-default"
                                    )}
                                    style={{
                                        backgroundColor,
                                        borderColor
                                    }}
                                    title={viewMode === 'aggregate' ? `${voteCount} votes` : undefined}
                                >
                                    {viewMode === 'aggregate' && voteCount > 0 && (
                                        <span className="text-xs font-bold text-white opacity-90">
                                            {voteCount}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Heatmap;
