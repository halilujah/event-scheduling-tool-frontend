/**
 * Generate an ICS (iCalendar) file content for a finalized event
 */
export function generateICS(
  eventTitle: string,
  finalizedTime: string,
  timezone: string,
  organizerName: string
): string {
  // Parse the finalized time (format: "YYYY-MM-DD HH:mm")
  const [datePart, timePart] = finalizedTime.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');

  // Create Date object for start time
  const startDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );

  // Assume 1 hour duration by default
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  // Format dates to ICS format (YYYYMMDDTHHMMSS)
  const formatICSDate = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return (
      date.getFullYear() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  };

  const startDateStr = formatICSDate(startDate);
  const endDateStr = formatICSDate(endDate);
  const now = formatICSDate(new Date());

  // Generate unique ID
  const uid = `event-${Date.now()}@event-scheduler`;

  // Build ICS content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event Scheduler//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-TIMEZONE:${timezone}`,
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:Scheduled meeting organized by ${organizerName}`,
    `ORGANIZER;CN=${organizerName}:mailto:noreply@event-scheduler.com`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Event starts in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

/**
 * Trigger download of an ICS file
 */
export function downloadICS(
  eventTitle: string,
  finalizedTime: string,
  timezone: string,
  organizerName: string
): void {
  const icsContent = generateICS(eventTitle, finalizedTime, timezone, organizerName);

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
