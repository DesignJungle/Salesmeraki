import { io, Socket } from 'socket.io-client';

interface SocketServiceOptions {
  url?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

class SocketService {
  private socket: Socket | null = null;
  private defaultOptions: SocketServiceOptions = {
    url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  };

  constructor(options: SocketServiceOptions = {}) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  connect(token?: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      try {
        const { url, ...options } = this.defaultOptions;
        
        this.socket = io(url as string, {
          ...options,
          auth: token ? { token } : undefined,
        });

        this.socket.on('connect', () => {
          console.log('Socket connected');
          resolve(this.socket as Socket);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
        });

        this.socket.connect();
      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn('Socket not connected. Cannot listen to event:', event);
    }
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
