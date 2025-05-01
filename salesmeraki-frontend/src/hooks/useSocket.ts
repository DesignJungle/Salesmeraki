import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import socketService from '@/services/socketService';
import { Socket } from 'socket.io-client';

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    try {
      if (!session) {
        throw new Error('No active session. Authentication required.');
      }

      // Use the session token for authentication
      const token = (session as any)?.accessToken;
      const socketInstance = await socketService.connect(token);
      
      setSocket(socketInstance);
      setIsConnected(true);
      setError(null);
      
      return socketInstance;
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
      console.error('Socket connection error:', err);
      return null;
    }
  }, [session]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setSocket(null);
    setIsConnected(false);
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketService.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    socketService.off(event, callback);
  }, []);

  // Auto-connect when session is available
  useEffect(() => {
    if (session && !isConnected && !socket) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session, isConnected, socket, connect, disconnect]);

  return {
    socket,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}
