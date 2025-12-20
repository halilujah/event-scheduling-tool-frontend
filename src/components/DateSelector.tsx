import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../contexts/LanguageContext';

interface DateSelectorProps {
    selectedDates: Date[];
    onSelect: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDates, onSelect }) => {
    const { t } = useLanguage();
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    // Fill in empty slots for the first week
    const startDay = getDay(startOfMonth(currentMonth));
    const emptyDays = Array(startDay).fill(null);

    const isSelected = (date: Date) => {
        return selectedDates.some(d => isSameDay(d, date));
    };

    const getMonthName = (date: Date) => {
        const monthIndex = date.getMonth();
        const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const;
        return t.dateTime.months[monthKeys[monthIndex]];
    };

    const getDayAbbreviations = () => {
        return [
            t.dateTime.daysShort.sun,
            t.dateTime.daysShort.mon,
            t.dateTime.daysShort.tue,
            t.dateTime.daysShort.wed,
            t.dateTime.daysShort.thu,
            t.dateTime.daysShort.fri,
            t.dateTime.daysShort.sat,
        ];
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:text-[var(--color-accent)] transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h3 className="text-lg font-bold text-white">
                    {getMonthName(currentMonth)} {format(currentMonth, 'yyyy')}
                </h3>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:text-[var(--color-accent)] transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="calendar-grid mb-4">
                {getDayAbbreviations().map((day, index) => (
                    <div key={index} className="day-label">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-grid">
                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map(date => {
                    const selected = isSelected(date);
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onSelect(date)}
                            className={clsx("date-cell", selected && "selected")}
                        >
                            {format(date, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DateSelector;
