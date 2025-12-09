import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { format, addMinutes } from 'date-fns';

interface HeatmapProps {
    dates: Date[];
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    votes?: Record<string, number>; // "YYYY-MM-DD HH:mm" -> count
    viewMode: 'personal' | 'aggregate';
    selectedSlots?: string[];
    onSlotsChange?: (slots: string[]) => void;
    isFinalized?: boolean;
    isOrganizerInAggregateMode?: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({
    dates,
    startTime,
    endTime,
    votes = {},
    viewMode,
    selectedSlots: externalSelectedSlots,
    onSlotsChange,
    isFinalized = false,
    isOrganizerInAggregateMode = false
}) => {
    const [internalSelectedSlots, setInternalSelectedSlots] = useState<string[]>([]);
    const selectedSlots = externalSelectedSlots !== undefined ? externalSelectedSlots : internalSelectedSlots;

    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const touchMovedRef = useRef(false);

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

    const toggleSlot = (date: Date, time: string, forceMode?: 'select' | 'deselect') => {
        const key = `${format(date, 'yyyy-MM-dd')} ${time}`;
        let newSlots: string[];

        if (forceMode === 'select') {
            // Always add to selection
            newSlots = selectedSlots.includes(key) ? selectedSlots : [...selectedSlots, key];
        } else if (forceMode === 'deselect') {
            // Always remove from selection
            newSlots = selectedSlots.filter(k => k !== key);
        } else {
            // Toggle
            newSlots = selectedSlots.includes(key)
                ? selectedSlots.filter(k => k !== key)
                : [...selectedSlots, key];
        }

        if (onSlotsChange) {
            onSlotsChange(newSlots);
        } else {
            setInternalSelectedSlots(newSlots);
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, date: Date, time: string) => {
        const pointerType = e.pointerType || 'mouse';

        if (pointerType !== 'mouse') {
            // For touch/pen, treat as tap-only; allow scrolling by not preventing default
            touchStartRef.current = { x: e.clientX, y: e.clientY };
            touchMovedRef.current = false;
            return;
        }

        const key = `${format(date, 'yyyy-MM-dd')} ${time}`;

        // In aggregate mode, just toggle without drag
        if (viewMode === 'aggregate') {
            e.preventDefault();
            toggleSlot(date, time);
            return;
        }

        const isCurrentlySelected = selectedSlots.includes(key);

        // Set drag mode based on initial click
        e.preventDefault();
        setDragMode(isCurrentlySelected ? 'deselect' : 'select');
        setIsDragging(true);

        // Toggle the clicked slot
        toggleSlot(date, time);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, date: Date, time: string) => {
        const pointerType = e.pointerType || 'mouse';

        if (pointerType !== 'mouse') {
            if (touchStartRef.current) {
                const dx = Math.abs(e.clientX - touchStartRef.current.x);
                const dy = Math.abs(e.clientY - touchStartRef.current.y);
                if (dx > 10 || dy > 10) touchMovedRef.current = true;
            }
            return;
        }

        if (isDragging && dragMode) {
            toggleSlot(date, time, dragMode);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, date: Date, time: string) => {
        const pointerType = e.pointerType || 'mouse';

        if (pointerType !== 'mouse') {
            if (!touchMovedRef.current) {
                toggleSlot(date, time);
            }
            touchStartRef.current = null;
            touchMovedRef.current = false;
            return;
        }

        setIsDragging(false);
        setDragMode(null);
    };

    // Add global mouse up listener to handle drag end outside component
    React.useEffect(() => {
        const handleGlobalPointerUp = () => {
            setIsDragging(false);
            setDragMode(null);
        };

        document.addEventListener('pointerup', handleGlobalPointerUp);
        document.addEventListener('pointercancel', handleGlobalPointerUp);
        return () => {
            document.removeEventListener('pointerup', handleGlobalPointerUp);
            document.removeEventListener('pointercancel', handleGlobalPointerUp);
        };
    }, []);

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
                            const isFinalizedSlot = isFinalized && isSelected;

                            let backgroundColor;
                            let borderColor = 'var(--color-border)';

                            if (isFinalizedSlot) {
                                // Finalized slot - green color
                                backgroundColor = 'rgba(34, 197, 94, 0.8)';
                                borderColor = 'rgba(34, 197, 94, 1)';
                            } else if (viewMode === 'personal') {
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
                                    onPointerDown={(e) => handlePointerDown(e, date, time)}
                                    onPointerMove={(e) => {
                                        if (e.pointerType === 'mouse' && e.buttons !== 1) return;
                                        handlePointerMove(e, date, time);
                                    }}
                                    onPointerUp={(e) => handlePointerUp(e, date, time)}
                                    className={clsx(
                                        "heatmap-cell",
                                        viewMode === 'personal' && isSelected && "selected",
                                        viewMode === 'personal' && "select-none",
                                        isOrganizerInAggregateMode && "cursor-pointer hover:ring-2 hover:ring-yellow-400 hover:scale-105 transition-all",
                                        isFinalizedSlot && "ring-2 ring-green-400"
                                    )}
                                    style={{
                                        backgroundColor,
                                        borderColor,
                                        userSelect: 'none'
                                    }}
                                    title={viewMode === 'aggregate' ? `${voteCount} votes${isFinalizedSlot ? ' (FINALIZED)' : ''}` : undefined}
                                >
                                    {viewMode === 'aggregate' && voteCount > 0 && (
                                        <span className={clsx(
                                            "text-xs font-bold text-white opacity-90",
                                            isFinalizedSlot && "text-lg"
                                        )}>
                                            {voteCount}{isFinalizedSlot && ' ✓'}
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
