import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { format, isBefore, startOfDay, isToday } from 'date-fns';
import DateSelector from '../components/DateSelector';
import DayOfWeekSelector from '../components/DayOfWeekSelector';
import TimeRangeSlider from '../components/TimeRangeSlider';
import { api } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';
import { TIMEZONE_GROUPS } from '../utils/timezones';
import { detectUserTimezone, getTimezoneLabel } from '../utils/timezoneUtils';
import { getRecentEvents, formatRelativeTime, addRecentEvent, type RecentEvent } from '../utils/recentEvents';

type Tab = 'dates' | 'days';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [organizerName, setOrganizerName] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('dates');

    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [timezone, setTimezone] = useState('UTC');
    const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null);
    const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);

    // Auto-detect user's timezone on mount
    useEffect(() => {
        const detected = detectUserTimezone();
        setDetectedTimezone(detected);
        setTimezone(detected);
    }, []);

    // Load recent events on mount
    useEffect(() => {
        const events = getRecentEvents(3);
        setRecentEvents(events);
    }, []);

    const handleDateSelect = (date: Date) => {
        setSelectedDates(prev => {
            const exists = prev.some(d => d.getTime() === date.getTime());
            if (exists) {
                return prev.filter(d => d.getTime() !== date.getTime());
            }
            return [...prev, date];
        });
    };

    const handleDayToggle = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async () => {
        // 1. Validate organizer name
        if (!organizerName.trim()) {
            alert(t.createEvent.validationOrganizerName);
            return;
        }

        // 2. Validate date/day selection based on active tab
        if (activeTab === 'dates') {
            if (selectedDates.length === 0) {
                alert(t.createEvent.validationDates);
                return;
            }

            // 3. Check for past dates
            const hasPastDates = selectedDates.some(date =>
                isBefore(startOfDay(date), startOfDay(new Date()))
            );
            if (hasPastDates) {
                alert(t.createEvent.validationPastDates);
                return;
            }

            // 4. Check if start time is in the past for today's date
            const hasToday = selectedDates.some(date => isToday(date));
            if (hasToday) {
                const now = new Date();
                const [hours, minutes] = startTime.split(':').map(Number);
                const timeDate = new Date();
                timeDate.setHours(hours, minutes, 0, 0);

                if (isBefore(timeDate, now)) {
                    alert(t.createEvent.validationPastTime);
                    return;
                }
            }
        } else {
            // For 'days of week' mode
            if (selectedDays.length === 0) {
                alert(t.createEvent.validationDays);
                return;
            }
        }

        // 5. Validate time range
        if (startTime >= endTime) {
            alert(t.createEvent.validationTimeRange);
            return;
        }

        try {
            const formattedDates = selectedDates.map(date => format(date, 'yyyy-MM-dd'));

            const response = await api.createEvent({
                title: title || 'Untitled Event',
                type: activeTab,
                selectedDates: formattedDates,
                selectedDays,
                startTime,
                endTime,
                timezone,
                organizerName: organizerName.trim(),
            });

            // Store organizer ID in localStorage
            localStorage.setItem(`event_${response.eventId}_organizer`, organizerName.trim());

            // Track recent event
            addRecentEvent(
                response.eventId,
                title || 'Untitled Event',
                'organizer'
            );

            navigate(`/created/${response.eventId}`);
        } catch (error) {
            console.error('Failed to create event:', error);
            alert(t.errors.failedToLoad);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            {/* Recently Visited Events */}
            {recentEvents.length > 0 && (
                <div className="mb-8" style={{ marginTop: '2rem' }}>
                    <h2 className="text-xl font-bold mb-4 text-[var(--color-text-secondary)]">
                        {t.createEvent.recentlyVisited || 'Recently Visited'}
                    </h2>
                    <div className="flex-col">
                        {recentEvents.map((event) => (
                            <Link
                                key={event.eventId}
                                to={event.url}
                                className="flex-between py-2 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                                style={{ textDecoration: 'none' }}
                            >
                                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
                                    {event.title}
                                </span>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    {formatRelativeTime(event.visitedAt)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-col" style={{ gap: '2.5rem' }}>
                {/* Organizer Name */}
                <section>
                    <h2 className="text-xl font-bold mb-1 text-white">{t.createEvent.organizerName}</h2>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">{t.createEvent.organizerSubtitle}</p>
                    <input
                        type="text"
                        className="input-field"
                        style={{ fontSize: '1.25rem', padding: '1rem' }}
                        value={organizerName}
                        onChange={(e) => setOrganizerName(e.target.value)}
                        placeholder={t.createEvent.organizerNamePlaceholder}
                    />
                </section>

                {/* Event Name */}
                <section>
                    <h2 className="text-xl font-bold mb-1 text-white">{t.createEvent.eventTitle}</h2>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">{t.createEvent.eventTitleSubtitle}</p>
                    <input
                        type="text"
                        className="input-field"
                        style={{ fontSize: '1.25rem', padding: '1rem' }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t.createEvent.eventTitlePlaceholder}
                    />
                </section>

                {/* Date Selection */}
                <section>
                    <h2 className="text-xl font-bold mb-1 text-white">{t.createEvent.selectDates}</h2>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">{t.createEvent.selectDatesSubtitle}</p>

                    {/* Tabs */}
                    <div className="tabs">
                        <div
                            onClick={() => setActiveTab('dates')}
                            className={clsx("tab-btn", activeTab === 'dates' && "active")}
                        >
                            {t.createEvent.typeSpecific}
                        </div>
                        <div
                            onClick={() => setActiveTab('days')}
                            className={clsx("tab-btn", activeTab === 'days' && "active")}
                        >
                            {t.createEvent.typeDaysOfWeek}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'dates' ? (
                            <DateSelector selectedDates={selectedDates} onSelect={handleDateSelect} />
                        ) : (
                            <div style={{ padding: '2rem 0' }}>
                                <DayOfWeekSelector selectedDays={selectedDays} onToggle={handleDayToggle} />
                            </div>
                        )}
                    </div>
                </section>

                {/* Time Selection */}
                <section>
                    <h2 className="text-xl font-bold mb-1 text-white">{t.createEvent.timeRange}</h2>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">{t.createEvent.timeRangeSubtitle}</p>
                    <TimeRangeSlider
                        startTime={startTime}
                        endTime={endTime}
                        onChange={(s, e) => { setStartTime(s); setEndTime(e); }}
                        selectedDates={selectedDates}
                    />
                </section>

                {/* Timezone */}
                <section>
                    <h2 className="text-xl font-bold mb-4 text-white">{t.createEvent.timezone}</h2>
                    <select
                        className="input-field"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                    >
                        {Object.entries(TIMEZONE_GROUPS).map(([region, timezones]) => (
                            <optgroup key={region} label={region}>
                                {timezones.map(tz => (
                                    <option
                                        key={tz.value}
                                        value={tz.value}
                                        title={`${tz.label} - ${tz.utcOffset}`}
                                    >
                                        {tz.label} ({tz.utcOffset})
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    {detectedTimezone && timezone === detectedTimezone && (
                        <p className="text-sm text-green-400 mt-2">
                            ✓ Auto-detected: {getTimezoneLabel(timezone)}
                        </p>
                    )}
                </section>

                {/* Submit */}
                <div className="flex-center pt-4">
                    <button
                        onClick={handleSubmit}
                        className="btn-primary"
                        style={{ width: '100%', maxWidth: '300px' }}
                    >
                        {t.createEvent.createButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
