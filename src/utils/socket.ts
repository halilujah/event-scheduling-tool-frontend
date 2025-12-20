import { io, Socket } from 'socket.io-client';

// Use Google Cloud Run backend by default; override with VITE_API_URL for local/dev.
const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://cloktopus-backend-730946715554.europe-west1.run.app';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinEventRoom = (eventId: string) => {
  const socket = getSocket();
  socket.emit('join_event', { eventId });
};

export const leaveEventRoom = (eventId: string) => {
  const socket = getSocket();
  socket.emit('leave_event', { eventId });
};
