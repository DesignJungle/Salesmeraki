export enum PresenceStatus {
  ONLINE = 'ONLINE',
  BUSY = 'BUSY',
  AWAY = 'AWAY',
  OFFLINE = 'OFFLINE'
}

type MessageHandler = (data: any) => void;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isProduction: boolean;
  
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }
  
  debug(...args: any[]): void {
    if (!this.isProduction) {
      console.log('[DEBUG]', ...args);
    }
  }
  
  info(...args: any[]): void {
    if (!this.isProduction) {
      console.info('[INFO]', ...args);
    }
  }
  
  warn(...args: any[]): void {
    console.warn('[WARN]', ...args);
  }
  
  error(...args: any[]): void {
    console.error('[ERROR]', ...args);
  }
}

export const logger = new Logger();

// WebSocket service for real-time collaboration
class WebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: Record<string, Function[]> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private userId: string | null = null;

  constructor() {
    this.initialize = this.initialize.bind(this);
    this.connect = this.connect.bind(this);
    this.reconnect = this.reconnect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.send = this.send.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.subscribeToDocumentChanges = this.subscribeToDocumentChanges.bind(this);
  }

  initialize(userId: string) {
    this.userId = userId;
    this.connect();
  }

  connect() {
    try {
      // Use environment variable for WebSocket URL
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.salesmeraki.com/ws';
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        
        // Authenticate the connection
        if (this.userId) {
          this.send('authenticate', { userId: this.userId });
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;
          
          // Notify subscribers
          if (this.subscribers[type]) {
            this.subscribers[type].forEach(callback => callback(payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.reconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.reconnect();
    }
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  send(type: string, payload: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  subscribe(type: string, callback: Function) {
    if (!this.subscribers[type]) {
      this.subscribers[type] = [];
    }
    
    this.subscribers[type].push(callback);
  }

  unsubscribe(type: string, callback: Function) {
    if (this.subscribers[type]) {
      this.subscribers[type] = this.subscribers[type].filter(cb => cb !== callback);
    }
  }

  // Helper method for document collaboration
  subscribeToDocumentChanges(documentId: string, callback: Function) {
    const channelName = `document_${documentId}`;
    this.subscribe(channelName, callback);
  }
}

// Create singleton instance
export const wsService = new WebSocketService();
