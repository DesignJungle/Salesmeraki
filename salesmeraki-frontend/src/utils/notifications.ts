export enum NotificationType {
  CHAT_MENTION = 'CHAT_MENTION',
  DOCUMENT_SHARE = 'DOCUMENT_SHARE',
  TEAM_ACTIVITY = 'TEAM_ACTIVITY',
  THREAD_REPLY = 'THREAD_REPLY',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

class NotificationService {
  private ws: WebSocket | null = null;

  initialize(token: string) {
    this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications?token=${token}`);
    
    this.ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.showNotification(notification);
    };
  }

  private showNotification(notification: Notification) {
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
      });
    }

    // Dispatch event for in-app notification
    const event = new CustomEvent('new-notification', { detail: notification });
    window.dispatchEvent(event);
  }

  async requestPermission() {
    return await Notification.requestPermission();
  }
}

export const notificationService = new NotificationService();