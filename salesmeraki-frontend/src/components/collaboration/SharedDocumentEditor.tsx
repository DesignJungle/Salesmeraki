import React, { useState, useEffect } from 'react';
import { wsService } from '@/utils/websocket';

interface SharedDocumentEditorProps {
  documentId: string;
  initialContent: string;
}

export function SharedDocumentEditor({ documentId, initialContent }: SharedDocumentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    wsService.subscribeToDocumentChanges(documentId, handleDocumentChange);
    wsService.send('document_join', { documentId });

    return () => {
      wsService.unsubscribe(`document_${documentId}`, handleDocumentChange);
      wsService.send('document_leave', { documentId });
    };
  }, [documentId]);

  const handleDocumentChange = (data: { content: string; userId: string }) => {
    setContent(data.content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    wsService.send('document_update', {
      documentId,
      content: newContent,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Document Editor</h3>
        <div className="flex space-x-2">
          {activeUsers.map(user => (
            <div key={user} className="w-8 h-8 rounded-full bg-blue-500" />
          ))}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="flex-1 p-4 resize-none focus:outline-none"
        placeholder="Start typing..."
      />
    </div>
  );
}