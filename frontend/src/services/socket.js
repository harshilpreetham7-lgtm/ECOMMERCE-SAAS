import { io } from 'socket.io-client';

let socket;

const getSocketBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return apiUrl.replace(/\/api.*$/, '');
};

export function connectSocket(token, onEvent) {
  if (socket && socket.auth?.token === token) {
    return socket;
  }

  socket = io(getSocketBaseURL(), {
    auth: {
      token,
    },
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect error:', err.message);
  });

  socket.on('live-sale', (payload) => onEvent?.('live-sale', payload));
  socket.on('vendor-sale', (payload) => onEvent?.('vendor-sale', payload));
  socket.on('platform-sale', (payload) => onEvent?.('platform-sale', payload));

  return socket;
}
