export interface TeamMember {
  id: string;
  name: string;
  role: string;
  isOnline: boolean;
  lastActive: string;
  customStatus?: string;
  performance: {
    deals: number;
    revenue: number;
    activities: number;
  };
}

export interface CollaborationEvent {
  id: string;
  type: CollaborationEventType;
  user: string;
  timestamp: string;
  description: string;
  metadata: Record<string, any>;
}

export type CollaborationEventType = 
  | 'DOCUMENT_EDIT'
  | 'DOCUMENT_SHARE'
  | 'CHAT_MESSAGE'
  | 'THREAD_REPLY'
  | 'DEAL_UPDATE'
  | 'TASK_COMPLETE'
  | 'USER_STATUS_CHANGE';

export interface SharedDocument {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  // Add other fields as needed
}

export interface DocumentChange {
  id: string;
  documentId: string;
  userId: string;
  timestamp: string;
  changes: any;
}
