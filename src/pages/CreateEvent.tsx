import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { format } from 'date-fns';
import DateSelector from '../components/DateSelector';
import DayOfWeekSelector from '../components/DayOfWeekSelector';
import TimeRangeSlider from '../components/TimeRangeSlider';
import { api } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';

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
    const [timezone, setTimezone] = useState('Europe/Istanbul');

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
        if (!organizerName.trim()) {
            alert(t.createEvent.validationOrganizerName);
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

            navigate(`/created/${response.eventId}`);
        } catch (error) {
            console.error('Failed to create event:', error);
            alert(t.errors.failedToLoad);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            {/* Header Section */}
            {/* <div className="mb-8" style={{ marginTop: '2rem' }}>
                <h2 className="text-xl font-bold mb-4 text-[var(--color-text-secondary)]">Recently visited</h2>
                <div className="flex-col">
                    {['meeting2', 'meeting1', 'test'].map((item, i) => (
                        <div key={i} className="flex-between py-2 border-b border-[var(--color-border)]">
                            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{item}</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Created 1 month ago</span>
                        </div>
                    ))}
                </div>
            </div> */}

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
                        <option value="Europe/Istanbul">Europe/Istanbul</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                    </select>
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
