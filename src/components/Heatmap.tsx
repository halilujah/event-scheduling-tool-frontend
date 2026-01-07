import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { format, addMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useLanguage } from '../contexts/LanguageContext';

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
    organizerTimezone?: string;
    viewerTimezone?: string;
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
    isOrganizerInAggregateMode = false,
    organizerTimezone,
    viewerTimezone
}) => {
    const { t } = useLanguage();
    const [internalSelectedSlots, setInternalSelectedSlots] = useState<string[]>([]);
    const selectedSlots = externalSelectedSlots !== undefined ? externalSelectedSlots : internalSelectedSlots;
    const displayTimezone = viewerTimezone || organizerTimezone;

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

    const getDisplayDate = (date: Date) => {
        return displayTimezone ? toZonedTime(date, displayTimezone) : date;
    };

    const getDateKey = (date: Date) => format(getDisplayDate(date), 'yyyy-MM-dd');

    const toggleSlot = (date: Date, time: string, forceMode?: 'select' | 'deselect') => {
        const key = `${getDateKey(date)} ${time}`;
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

    const getDayAbbrWithDate = (date: Date, index: number, allDates: Date[]) => {
        const displayDate = getDisplayDate(date);
        const dayIndex = displayDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
        const dayAbbr = t.dateTime.daysShort[dayKeys[dayIndex]];
        const dayNum = displayDate.getDate();

        // Get month abbreviation
        const monthKeys = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ] as const;
        const monthAbbr = t.dateTime.months[monthKeys[displayDate.getMonth()]].substring(0, 3);

        // Show year only when it changes (compare with previous date)
        const year = displayDate.getFullYear();
        const prevYear = index > 0 ? getDisplayDate(allDates[index - 1]).getFullYear() : null;
        const showYear = prevYear === null || prevYear !== year;

        // Line 1: Day + Date (e.g., "Mon 15")
        const line1 = `${dayAbbr} ${dayNum}`;

        // Line 2: Month + Year (e.g., "Jan 2026" or just "Jan")
        const line2 = showYear ? `${monthAbbr} ${year}` : monthAbbr;

        return { line1, line2 };
    };

    return (
        <div className="heatmap-container">
            {viewerTimezone && organizerTimezone && (
                <div className="text-xs text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                    <span>🌍</span>
                    <span>
                        Times displayed in: <strong className="text-[var(--color-text-secondary)]">{viewerTimezone}</strong>
                    </span>
                    {viewerTimezone !== organizerTimezone && (
                        <span className="ml-2">
                            (Organizer: {organizerTimezone})
                        </span>
                    )}
                </div>
            )}
            <div className="heatmap-grid" style={{
                gridTemplateColumns: `auto repeat(${dates.length}, minmax(80px, 1fr))`,
            }}>
                {/* Header Row (Dates) */}
                <div className="p-2"></div>
                {dates.map((date, i) => {
                    const { line1, line2 } = getDayAbbrWithDate(date, i, dates);
                    return (
                        <div key={i} className="heatmap-header-cell">
                            <div className="heatmap-header-line1">{line1}</div>
                            <div className="heatmap-header-line2">{line2}</div>
                        </div>
                    );
                })}

                {/* Time Rows */}
                {slots.map((time) => (
                    <React.Fragment key={time}>
                        <div className="heatmap-time-label">
                            {time}
                        </div>
                        {dates.map((date, i) => {
                            const key = `${getDateKey(date)} ${time}`;
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
