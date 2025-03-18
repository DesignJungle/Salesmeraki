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

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  initialize(token: string) {
    this.connect(token);
  }

  private connect(token: string) {
    this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws?token=${token}`);
    
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.updatePresence(PresenceStatus.ONLINE);
    };

    this.ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      this.handlers.get(type)?.forEach(handler => handler(data));
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(token);
        }, 1000 * Math.pow(2, this.reconnectAttempts));
      }
    };
  }

  updatePresence(status: PresenceStatus, customMessage?: string) {
    this.send('presence_update', { status, customMessage });
  }

  subscribeToDocumentChanges(documentId: string, handler: MessageHandler) {
    this.subscribe(`document_${documentId}`, handler);
    this.send('document_subscribe', { documentId });
  }

  sendDocumentUpdate(documentId: string, changes: DocumentChange) {
    this.send('document_update', { documentId, changes });
  }

  subscribeToThreadUpdates(threadId: string, handler: MessageHandler) {
    this.subscribe(`thread_${threadId}`, handler);
  }

  subscribe(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  unsubscribe(type: string, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler);
  }

  send(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.updatePresence(PresenceStatus.OFFLINE);
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
