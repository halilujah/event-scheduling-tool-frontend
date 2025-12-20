import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TimeRangeSliderProps {
    startTime: string;
    endTime: string;
    onChange: (start: string, end: string) => void;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({ startTime, endTime, onChange }) => {
    const { t } = useLanguage();
    return (
        <div className="time-slider-container">
            <div className="time-inputs">
                <div className="time-input-group">
                    <span className="time-input-label">{t.dateTime.start}</span>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => onChange(e.target.value, endTime)}
                        className="input-field"
                    />
                </div>

                <div style={{ flex: 1, height: '2px', background: 'var(--color-border)', margin: '0 1rem' }}></div>

                <div className="time-input-group">
                    <span className="time-input-label">{t.dateTime.end}</span>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => onChange(startTime, e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>
        </div>
    );
};

export default TimeRangeSlider;
