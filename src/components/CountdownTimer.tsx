import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    deadline: string;  // ISO timestamp in UTC
    onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, onExpire }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const deadlineTime = new Date(deadline).getTime();
            const remaining = Math.max(0, deadlineTime - now);

            setTimeRemaining(remaining);

            if (remaining === 0 && !expired) {
                setExpired(true);
                if (onExpire) {
                    onExpire();
                }
            }
        };

        // Initial calculation
        calculateTimeRemaining();

        // Update every second
        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [deadline, expired, onExpire]);

    if (expired) {
        return (
            <div className="flex items-center gap-2 text-red-400 font-semibold">
                <span>⏰</span>
                <span>Voting deadline has passed</span>
            </div>
        );
    }

    // Convert milliseconds to hours, minutes, seconds
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Determine urgency color
    const isUrgent = hours < 1;
    const colorClass = isUrgent ? 'text-red-400' : 'text-yellow-400';

    return (
        <div className={`flex items-center gap-2 font-mono font-semibold ${colorClass}`}>
            <span>⏰</span>
            <span>
                {hours > 0 && `${hours}h `}
                {(hours > 0 || minutes > 0) && `${minutes}m `}
                {seconds}s
            </span>
            <span className="text-sm text-[var(--color-text-muted)] font-normal">
                remaining
            </span>
        </div>
    );
};

export default CountdownTimer;
