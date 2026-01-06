import { formatDistanceToNow } from 'date-fns';

const STORAGE_KEY = 'recently_visited_events';
const MAX_STORED_EVENTS = 10;

export interface RecentEvent {
  eventId: string;
  title: string;
  visitedAt: number;
  role: 'organizer' | 'participant';
  url: string;
}

/**
 * Add or update an event in the recent visits list
 * @param eventId - Event ID
 * @param title - Event title
 * @param role - User's role (organizer or participant)
 */
export function addRecentEvent(
  eventId: string,
  title: string,
  role: 'organizer' | 'participant'
): void {
  const url = role === 'organizer' ? `/created/${eventId}` : `/event/${eventId}`;
  const newEvent: RecentEvent = {
    eventId,
    title,
    visitedAt: Date.now(),
    role,
    url
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let events: RecentEvent[] = stored ? JSON.parse(stored) : [];

    // Remove duplicate (same eventId)
    events = events.filter(e => e.eventId !== eventId);

    // Add new event at the beginning
    events.unshift(newEvent);

    // Keep only MAX_STORED_EVENTS most recent
    events = events.slice(0, MAX_STORED_EVENTS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save recent event:', error);
  }
}

/**
 * Get recent events from localStorage
 * @param limit - Maximum number of events to return (default: 3)
 * @returns Array of recent events, sorted by most recent first
 */
export function getRecentEvents(limit: number = 3): RecentEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const events: RecentEvent[] = JSON.parse(stored);
    return events.slice(0, limit);
  } catch (error) {
    console.error('Failed to load recent events:', error);
    return [];
  }
}

/**
 * Format a timestamp as a relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
    return 'Recently';
  }
}
