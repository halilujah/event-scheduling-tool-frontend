export interface TimezoneOption {
    value: string;        // IANA identifier (e.g., "America/New_York")
    label: string;        // Display name (e.g., "New York")
    utcOffset: string;    // Current offset (e.g., "UTC-5/-4")
}

export const TIMEZONE_GROUPS: Record<string, TimezoneOption[]> = {
    Americas: [
        { value: "America/New_York", label: "New York", utcOffset: "UTC-5/-4" },
        { value: "America/Chicago", label: "Chicago", utcOffset: "UTC-6/-5" },
        { value: "America/Denver", label: "Denver", utcOffset: "UTC-7/-6" },
        { value: "America/Los_Angeles", label: "Los Angeles", utcOffset: "UTC-8/-7" },
        { value: "America/Phoenix", label: "Phoenix (No DST)", utcOffset: "UTC-7" },
        { value: "America/Toronto", label: "Toronto", utcOffset: "UTC-5/-4" },
        { value: "America/Vancouver", label: "Vancouver", utcOffset: "UTC-8/-7" },
        { value: "America/Mexico_City", label: "Mexico City", utcOffset: "UTC-6/-5" },
        { value: "America/Sao_Paulo", label: "São Paulo", utcOffset: "UTC-3" },
        { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", utcOffset: "UTC-3" },
        { value: "America/Santiago", label: "Santiago", utcOffset: "UTC-4/-3" },
    ],
    Europe: [
        { value: "Europe/London", label: "London", utcOffset: "UTC+0/+1" },
        { value: "Europe/Dublin", label: "Dublin", utcOffset: "UTC+0/+1" },
        { value: "Europe/Paris", label: "Paris", utcOffset: "UTC+1/+2" },
        { value: "Europe/Berlin", label: "Berlin", utcOffset: "UTC+1/+2" },
        { value: "Europe/Amsterdam", label: "Amsterdam", utcOffset: "UTC+1/+2" },
        { value: "Europe/Brussels", label: "Brussels", utcOffset: "UTC+1/+2" },
        { value: "Europe/Madrid", label: "Madrid", utcOffset: "UTC+1/+2" },
        { value: "Europe/Rome", label: "Rome", utcOffset: "UTC+1/+2" },
        { value: "Europe/Zurich", label: "Zurich", utcOffset: "UTC+1/+2" },
        { value: "Europe/Vienna", label: "Vienna", utcOffset: "UTC+1/+2" },
        { value: "Europe/Stockholm", label: "Stockholm", utcOffset: "UTC+1/+2" },
        { value: "Europe/Istanbul", label: "Istanbul", utcOffset: "UTC+3" },
        { value: "Europe/Athens", label: "Athens", utcOffset: "UTC+2/+3" },
        { value: "Europe/Moscow", label: "Moscow", utcOffset: "UTC+3" },
    ],
    Asia: [
        { value: "Asia/Dubai", label: "Dubai", utcOffset: "UTC+4" },
        { value: "Asia/Karachi", label: "Karachi", utcOffset: "UTC+5" },
        { value: "Asia/Kolkata", label: "Mumbai/Delhi", utcOffset: "UTC+5:30" },
        { value: "Asia/Bangkok", label: "Bangkok", utcOffset: "UTC+7" },
        { value: "Asia/Singapore", label: "Singapore", utcOffset: "UTC+8" },
        { value: "Asia/Hong_Kong", label: "Hong Kong", utcOffset: "UTC+8" },
        { value: "Asia/Shanghai", label: "Beijing/Shanghai", utcOffset: "UTC+8" },
        { value: "Asia/Tokyo", label: "Tokyo", utcOffset: "UTC+9" },
        { value: "Asia/Seoul", label: "Seoul", utcOffset: "UTC+9" },
        { value: "Asia/Jakarta", label: "Jakarta", utcOffset: "UTC+7" },
        { value: "Asia/Manila", label: "Manila", utcOffset: "UTC+8" },
    ],
    Oceania: [
        { value: "Australia/Sydney", label: "Sydney", utcOffset: "UTC+10/+11" },
        { value: "Australia/Melbourne", label: "Melbourne", utcOffset: "UTC+10/+11" },
        { value: "Australia/Brisbane", label: "Brisbane", utcOffset: "UTC+10" },
        { value: "Australia/Perth", label: "Perth", utcOffset: "UTC+8" },
        { value: "Pacific/Auckland", label: "Auckland", utcOffset: "UTC+12/+13" },
    ],
    Africa: [
        { value: "Africa/Cairo", label: "Cairo", utcOffset: "UTC+2" },
        { value: "Africa/Johannesburg", label: "Johannesburg", utcOffset: "UTC+2" },
        { value: "Africa/Lagos", label: "Lagos", utcOffset: "UTC+1" },
        { value: "Africa/Nairobi", label: "Nairobi", utcOffset: "UTC+3" },
    ],
    Other: [
        { value: "UTC", label: "UTC (Universal Time)", utcOffset: "UTC+0" },
        { value: "Pacific/Honolulu", label: "Honolulu", utcOffset: "UTC-10" },
    ]
};

// Flatten all timezones into a single array for easy lookup
export const ALL_TIMEZONES: TimezoneOption[] = Object.values(TIMEZONE_GROUPS).flat();

// Helper function to get timezone option by value
export function getTimezoneOption(value: string): TimezoneOption | undefined {
    return ALL_TIMEZONES.find(tz => tz.value === value);
}
