import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/errorHandler';
import { Spinner } from '@/components/ui/Spinner';
import { SharedDocumentEditor } from '@/components/collaboration/SharedDocumentEditor';
import { UserCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

interface WorkflowCollaborationProps {
  workflowId?: string;
}

export default function WorkflowCollaboration({ workflowId }: WorkflowCollaborationProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [documentContent, setDocumentContent] = useState('');

  useEffect(() => {
    if (!workflowId) return;
    
    const fetchCollaborationData = async () => {
      try {
        setLoading(true);
        
        // Fetch team members
        const membersData = await fetchWithAuth(`/api/workflows/${workflowId}/team`);
        setTeamMembers(membersData || []);
        
        // Fetch comments
        const commentsData = await fetchWithAuth(`/api/workflows/${workflowId}/comments`);
        setComments(commentsData || []);
        
        // Fetch shared document
        const docData = await fetchWithAuth(`/api/workflows/${workflowId}/document`);
        setDocumentContent(docData?.content || 'Start collaborating on this workflow...');
      } catch (err) {
        console.error('Error fetching collaboration data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load collaboration data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollaborationData();
  }, [workflowId]);

  const handleAddComment = async () => {
    if (!workflowId || !newComment.trim()) return;
    
    try {
      const comment = await fetchWithAuth(`/api/workflows/${workflowId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment }),
      });
      
      if (comment) {
        setComments([...comments, comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const handleCommentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddComment();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Comments</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                  {comment.user.avatar ? (
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.name} 
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <form onSubmit={handleCommentFormSubmit} className="mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Team Members</h3>
          
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No team members found</p>
            ) : (
              teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-2">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
