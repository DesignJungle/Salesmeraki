import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/errorHandler';
import { UserIcon, ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/ui/Spinner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  stepId?: string;
}

interface WorkflowCollaborationProps {
  workflowId: string;
}

export default function WorkflowCollaboration({ workflowId }: WorkflowCollaborationProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchCollaborationData = async () => {
      try {
        setLoading(true);
        
        // Fetch team members
        const membersData = await fetchWithAuth(`/api/workflows/${workflowId}/team`);
        setTeamMembers(membersData || []);
        
        // Fetch comments
        const commentsData = await fetchWithAuth(`/api/workflows/${workflowId}/comments`);
        setComments(commentsData || []);
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
    if (!newComment.trim()) return;
    
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="text-red-500 p-4 bg-red-50 border border-red-200 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Team Members Panel */}
      <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Team Members</h2>
        
        <div className="space-y-4">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No team members assigned to this workflow yet.</p>
          )}
        </div>
        
        <div className="mt-6">
          <button
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Invite Team Member
          </button>
        </div>
      </div>
      
      {/* Comments Panel */}
      <div className="md:col-span-2 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Discussion</h2>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt={comment.userName} className="h-10 w-10 rounded-full" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{comment.userName}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">No comments yet. Start the discussion!</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}