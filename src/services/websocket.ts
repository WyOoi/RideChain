import { io, Socket } from 'socket.io-client';
import { Ride } from '../types/ride';

let socket: Socket | null = null;

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'https://ridechain-websocket.vercel.app';

// Initialize Socket.io connection
export const initializeSocket = () => {
  if (!socket) {
    socket = io(WEBSOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }
  
  return socket;
};

// Get the socket instance
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

// Subscribe to ride updates
export const subscribeToRideUpdates = (callback: (ride: Ride) => void) => {
  const socket = getSocket();
  socket.on('rideUpdated', callback);
  
  return () => {
    socket.off('rideUpdated', callback);
  };
};

// Subscribe to new rides
export const subscribeToNewRides = (callback: (ride: Ride) => void) => {
  const socket = getSocket();
  socket.on('newRide', callback);
  
  return () => {
    socket.off('newRide', callback);
  };
};

// Subscribe to deleted rides
export const subscribeToDeletedRides = (callback: (rideId: string) => void) => {
  const socket = getSocket();
  socket.on('rideDeleted', callback);
  
  return () => {
    socket.off('rideDeleted', callback);
  };
};

// Emit a new ride
export const emitNewRide = (ride: Ride) => {
  const socket = getSocket();
  socket.emit('newRide', ride);
};

// Emit an updated ride
export const emitRideUpdate = (ride: Ride) => {
  const socket = getSocket();
  socket.emit('updateRide', ride);
};

// Emit a deleted ride
export const emitRideDeleted = (rideId: string) => {
  const socket = getSocket();
  socket.emit('deleteRide', rideId);
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 