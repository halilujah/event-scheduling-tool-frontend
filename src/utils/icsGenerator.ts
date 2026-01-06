import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

/**
 * Generate an ICS (iCalendar) file content for a finalized event
 */
export function generateICS(
  eventTitle: string,
  finalizedTime: string,
  timezone: string,
  organizerName: string,
  location?: string,
  description?: string
): string {
  // Parse the finalized time (format: "YYYY-MM-DD HH:mm") in organizer's timezone
  const [datePart, timePart] = finalizedTime.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  // Create date in organizer's timezone
  const organizerDate = new Date(year, month - 1, day, hours, minutes);

  // Convert to UTC
  const utcDate = fromZonedTime(organizerDate, timezone);

  // Assume 1 hour duration by default
  const endDate = new Date(utcDate.getTime() + 60 * 60 * 1000);

  // Format dates to ICS format in UTC with 'Z' suffix (YYYYMMDDTHHMMSSZ)
  const formatICSDateUTC = (date: Date): string => {
    return formatInTimeZone(date, 'UTC', "yyyyMMdd'T'HHmmss'Z'");
  };

  const startDateStr = formatICSDateUTC(utcDate);
  const endDateStr = formatICSDateUTC(endDate);
  const now = formatICSDateUTC(new Date());

  // Generate unique ID
  const uid = `event-${Date.now()}@event-scheduler`;

  // Escape special characters in ICS fields (commas, semicolons, backslashes)
  const escapeICS = (text: string): string => {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  };

  // Build description
  const eventDescription = description
    ? escapeICS(description)
    : `Scheduled event organized by ${escapeICS(organizerName)}. Finalized time: ${finalizedTime} (${timezone})`;

  // Build ICS content with proper UTC format
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event Scheduler//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDateStr}`,  // UTC format with 'Z' suffix
    `DTEND:${endDateStr}`,      // UTC format with 'Z' suffix
    `SUMMARY:${escapeICS(eventTitle)}`,
    `DESCRIPTION:${eventDescription}`,
  ];

  // Add location if provided
  if (location && location.trim()) {
    icsLines.push(`LOCATION:${escapeICS(location)}`);
  }

  // Add remaining fields
  icsLines.push(
    `ORGANIZER;CN=${escapeICS(organizerName)}:mailto:noreply@event-scheduler.com`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Event starts in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  );

  const icsContent = icsLines.join('\r\n');

  return icsContent;
}

/**
 * Trigger download of an ICS file
 */
export function downloadICS(
  eventTitle: string,
  finalizedTime: string,
  timezone: string,
  organizerName: string,
  location?: string,
  description?: string
): void {
  const icsContent = generateICS(eventTitle, finalizedTime, timezone, organizerName, location, description);

  // Create blob
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);

  // Generate filename from event title
  const filename = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(link.href);
}

/**
 * Generate Google Calendar URL for direct add
 */
export function getGoogleCalendarUrl(
  eventTitle: string,
  finalizedTime: string,
  timezone: string,
  organizerName: string,
  location?: string,
  description?: string
): string {
  // Parse the finalized time
  const [datePart, timePart] = finalizedTime.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  // Create date in organizer's timezone
  const organizerDate = new Date(year, month - 1, day, hours, minutes);
  const utcDate = fromZonedTime(organizerDate, timezone);

  // Format for Google Calendar (YYYYMMDDTHHmmssZ)
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const startDate = formatGoogleDate(utcDate);
  const endDate = formatGoogleDate(new Date(utcDate.getTime() + 60 * 60 * 1000));

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle,
    dates: `${startDate}/${endDate}`,
    details: description || `Scheduled event organized by ${organizerName}. Finalized time: ${finalizedTime} (${timezone})`,
    location: location || '',
    ctz: timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Web URL for direct add
 */
export function getOutlookUrl(
  eventTitle: string,
  finalizedTime: string,
  timezone: string,
  organizerName: string,
  location?: string,
  description?: string
): string {
  // Parse the finalized time
  const [datePart, timePart] = finalizedTime.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  const organizerDate = new Date(year, month - 1, day, hours, minutes);
  const utcDate = fromZonedTime(organizerDate, timezone);

  // Format for Outlook (ISO 8601)
  const startDate = utcDate.toISOString();
  const endDate = new Date(utcDate.getTime() + 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    subject: eventTitle,
    startdt: startDate,
    enddt: endDate,
    body: description || `Scheduled event organized by ${organizerName}. Finalized time: ${finalizedTime} (${timezone})`,
    location: location || '',
    path: '/calendar/action/compose',
    rru: 'addevent',
  });

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
