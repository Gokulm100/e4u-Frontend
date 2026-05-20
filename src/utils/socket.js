import { io } from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://e4u-backend.onrender.com';

let socket;
let boundUserId = null;
const chatListeners = new Set();

function dispatchChatMessage(payload) {
  console.log('📩 chat:new-message', payload);
  chatListeners.forEach((fn) => {
    try {
      fn(payload);
    } catch (err) {
      console.error('chat:new-message handler error', err);
    }
  });
}

function bindSocketEvents(sock, userId) {
  sock.off('connect');
  sock.on('connect', () => {
    console.log('✅ WebSocket Connected:', sock.id);
    sock.emit('join', userId);
    console.log('DEBUG: Emitting join event with ID:', userId);
  });

  sock.off('connect_error');
  sock.on('connect_error', (err) => {
    console.log('❌ WebSocket Error:', err.message);
  });

  sock.off('disconnect');
  sock.on('disconnect', (reason) => {
    console.log('🔌 WebSocket Disconnected:', reason);
  });

  sock.off('chat:new-message');
  sock.on('chat:new-message', dispatchChatMessage);

  if (sock.connected) {
    sock.emit('join', userId);
    console.log('DEBUG: Emitting join event with ID:', userId);
  }
}

export function emitJoin(userId) {
  if (!userId) return;
  const sock = socket || initSocket(userId);
  if (sock?.connected) {
    sock.emit('join', userId);
    console.log('DEBUG: Emitting join event with ID:', userId);
  }
}

export function subscribeChatMessages(listener) {
  chatListeners.add(listener);
  return () => chatListeners.delete(listener);
}

export const initSocket = (userId) => {
  if (!userId) return null;

  if (socket?.connected && boundUserId === userId) {
    bindSocketEvents(socket, userId);
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
    boundUserId = null;
  }

  socket = io(API_BASE_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    auth: { userId },
  });

  boundUserId = userId;
  bindSocketEvents(socket, userId);
  return socket;
};

export const getSocket = (userId) => {
  if (!socket) return initSocket(userId);
  if (userId && boundUserId !== userId) return initSocket(userId);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  boundUserId = null;
  chatListeners.clear();
};
