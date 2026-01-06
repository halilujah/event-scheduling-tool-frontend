import { format } from 'date-fns';
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';

/**
 * Detect user's current timezone using browser API
 * @returns IANA timezone identifier or 'UTC' as fallback
 */
export function detectUserTimezone(): string {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timezone || 'UTC';
    } catch {
        return 'UTC';
    }
}

/**
 * Convert a time slot string from one timezone to another
 * @param timeSlot - Format: "YYYY-MM-DD HH:mm" (in source timezone)
 * @param fromTimezone - Source timezone (IANA identifier)
 * @param toTimezone - Target timezone (IANA identifier)
 * @returns Converted time slot string in target timezone
 */
export function convertTimeSlot(
    timeSlot: string,
    fromTimezone: string,
    toTimezone: string
): string {
    if (fromTimezone === toTimezone) {
        return timeSlot; // No conversion needed
    }

    try {
        // Parse the time slot
        const [datePart, timePart] = timeSlot.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        // Create date in source timezone
        const sourceDate = new Date(year, month - 1, day, hours, minutes);

        // Convert from source timezone to UTC, then to target timezone
        const utcDate = fromZonedTime(sourceDate, fromTimezone);
        const targetDate = toZonedTime(utcDate, toTimezone);

        // Format back to string
        return format(targetDate, 'yyyy-MM-dd HH:mm');
    } catch (error) {
        console.error('Error converting timezone:', error);
        return timeSlot; // Return original on error
    }
}

/**
 * Convert multiple time slots from one timezone to another
 * @param timeSlots - Array of time slot strings
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns Object mapping original slot to converted slot
 */
export function convertTimeSlots(
    timeSlots: string[],
    fromTimezone: string,
    toTimezone: string
): Record<string, string> {
    const converted: Record<string, string> = {};

    timeSlots.forEach(slot => {
        converted[slot] = convertTimeSlot(slot, fromTimezone, toTimezone);
    });

    return converted;
}

/**
 * Get display label for timezone with current offset
 * @param timezone - IANA timezone identifier
 * @returns Human-readable timezone label with offset
 */
export function getTimezoneLabel(timezone: string): string {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'short'
        });
        const parts = formatter.formatToParts(now);
        const tzName = parts.find(part => part.type === 'timeZoneName')?.value || '';
        return `${timezone} (${tzName})`;
    } catch {
        return timezone;
    }
}

/**
 * Get current UTC offset for a timezone
 * @param timezone - IANA timezone identifier
 * @returns Offset string like "+03:00" or "-05:00"
 */
export function getTimezoneOffset(timezone: string): string {
    try {
        const now = new Date();
        const formatted = formatInTimeZone(now, timezone, 'xxx');
        return formatted;
    } catch {
        return '+00:00';
    }
}

/**
 * Convert a simple time string from one timezone to another
 * Uses today's date as reference for conversion
 * @param time - Time in "HH:mm" format
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns Converted time in "HH:mm" format
 */
export function convertTime(
    time: string,
    fromTimezone: string,
    toTimezone: string
): string {
    if (fromTimezone === toTimezone) {
        return time; // No conversion needed
    }

    try {
        const [hours, minutes] = time.split(':').map(Number);
        const today = new Date();
        today.setHours(hours, minutes, 0, 0);

        // Convert using timezone offset
        const utcDate = fromZonedTime(today, fromTimezone);
        const targetDate = toZonedTime(utcDate, toTimezone);

        return format(targetDate, 'HH:mm');
    } catch (error) {
        console.error('Error converting time:', error);
        return time; // Return original on error
    }
}
