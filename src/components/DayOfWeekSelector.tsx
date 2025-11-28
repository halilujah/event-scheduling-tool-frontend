import React from 'react';
import clsx from 'clsx';

interface DayOfWeekSelectorProps {
    selectedDays: number[]; // 0 = Sunday, 1 = Monday, etc.
    onToggle: (day: number) => void;
}

const DAYS = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
];

const DayOfWeekSelector: React.FC<DayOfWeekSelectorProps> = ({ selectedDays, onToggle }) => {
    return (
        <div className="day-selector">
            {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day.value);
                return (
                    <button
                        key={day.value}
                        onClick={() => onToggle(day.value)}
                        className={clsx("day-btn", isSelected && "selected")}
                    >
                        {day.label}
                    </button>
                );
            })}
        </div>
    );
};

export default DayOfWeekSelector;
