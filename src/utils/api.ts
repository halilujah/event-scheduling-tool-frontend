// Use Google Cloud Run backend by default; override with VITE_API_URL for local/dev.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cloktopus-backend-730946715554.europe-west1.run.app';

interface CreateEventPayload {
  title: string;
  type: 'dates' | 'days';
  selectedDates: string[];
  selectedDays: number[];
  startTime: string;
  endTime: string;
  timezone: string;
  organizerName: string;
}

interface CreateEventResponse {
  eventId: string;
  message: string;
}

interface Event {
  eventId: string;
  title: string;
  type: string;
  selectedDates: string[];
  selectedDays: number[];
  startTime: string;
  endTime: string;
  timezone: string;
  organizerName: string;
  isFinalized: boolean;
  finalizedTime: string | null;
  createdAt: string;
}

interface Participant {
  participantId: string;
  name: string;
  ipAddress?: string;
  joinedAt: string;
}

interface Vote {
  voteId: string;
  participantId: string;
  timeSlot: string;
}

export const api = {
  async createEvent(payload: CreateEventPayload): Promise<CreateEventResponse> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    return response.json();
  },

  async getEvent(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }

    return response.json();
  },

  async getParticipants(eventId: string): Promise<Participant[]> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`);

    if (!response.ok) {
      throw new Error('Failed to fetch participants');
    }

    return response.json();
  },

  async addParticipant(eventId: string, name: string): Promise<{ participantId: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to add participant');
    }

    return response.json();
  },

  async getVotes(eventId: string): Promise<Vote[]> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/votes`);

    if (!response.ok) {
      throw new Error('Failed to fetch votes');
    }

    return response.json();
  },

  async submitVotes(eventId: string, participantId: string, timeSlots: string[]): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participantId, timeSlots }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit votes');
    }

    return response.json();
  },

  async finalizeEvent(eventId: string, finalizedTime: string): Promise<{ message: string; finalizedTime: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/finalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ finalizedTime }),
    });

    if (!response.ok) {
      throw new Error('Failed to finalize event');
    }

    return response.json();
  },

  async getParticipantVotes(eventId: string, participantId: string): Promise<{ timeSlots: string[] }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants/${participantId}/votes`);

    if (!response.ok) {
      throw new Error('Failed to fetch participant votes');
    }

    return response.json();
  },

  async blockUser(eventId: string, participantId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participantId }),
    });

    if (!response.ok) {
      throw new Error('Failed to block user');
    }

    return response.json();
  },
};
