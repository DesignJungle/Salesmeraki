import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RealTimeNotifications } from './RealTimeNotifications';
import { useSocket } from '@/hooks/useSocket';

// Mock the useSocket hook
jest.mock('@/hooks/useSocket', () => ({
  useSocket: jest.fn(),
}));

describe('RealTimeNotifications', () => {
  const mockOn = jest.fn();
  const mockOff = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useSocket as jest.Mock).mockReturnValue({
      isConnected: true,
      on: mockOn,
      off: mockOff,
    });
  });

  it('renders the notification bell icon', () => {
    render(<RealTimeNotifications />);
    
    // Check if the bell icon is rendered
    expect(screen.getByRole('button', { name: /view notifications/i })).toBeInTheDocument();
  });
  
  it('shows notification count indicator when there are unread notifications', () => {
    // Mock initial notifications with unread items
    jest.spyOn(global, 'setTimeout').mockImplementationOnce((cb) => {
      (cb as Function)();
      return 1 as any;
    });
    
    render(<RealTimeNotifications />);
    
    // Check if the unread indicator is displayed
    const bellButton = screen.getByRole('button', { name: /view notifications/i });
    expect(bellButton.querySelector('.bg-red-500')).toBeInTheDocument();
  });
  
  it('opens the notification dropdown when clicked', () => {
    render(<RealTimeNotifications />);
    
    // Click on the bell icon
    fireEvent.click(screen.getByRole('button', { name: /view notifications/i }));
    
    // Check if the dropdown is displayed
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Deal Closed')).toBeInTheDocument();
    expect(screen.getByText('Meeting Reminder')).toBeInTheDocument();
  });
  
  it('marks a notification as read when clicked', async () => {
    render(<RealTimeNotifications />);
    
    // Open the dropdown
    fireEvent.click(screen.getByRole('button', { name: /view notifications/i }));
    
    // Click on "Mark as read" for a notification
    fireEvent.click(screen.getByText('Mark as read'));
    
    // Check if the notification is marked as read (no longer has the blue background)
    await waitFor(() => {
      const notificationElements = screen.getAllByText(/Follow-up Required/i);
      const notificationContainer = notificationElements[0].closest('div');
      expect(notificationContainer).not.toHaveClass('bg-blue-50');
    });
  });
  
  it('marks all notifications as read when clicked', async () => {
    render(<RealTimeNotifications />);
    
    // Open the dropdown
    fireEvent.click(screen.getByRole('button', { name: /view notifications/i }));
    
    // Click on "Mark all as read"
    fireEvent.click(screen.getByText('Mark all as read'));
    
    // Check if all notifications are marked as read
    await waitFor(() => {
      const notificationContainers = screen.getAllByText(/TechCorp|GlobalTech/i).map(el => 
        el.closest('div')
      );
      notificationContainers.forEach(container => {
        expect(container).not.toHaveClass('bg-blue-50');
      });
    });
  });
  
  it('deletes a notification when the X button is clicked', () => {
    render(<RealTimeNotifications />);
    
    // Open the dropdown
    fireEvent.click(screen.getByRole('button', { name: /view notifications/i }));
    
    // Get the initial count of notifications
    const initialNotifications = screen.getAllByText(/TechCorp|GlobalTech|Meeting/i).length;
    
    // Click on the X button of a notification
    const deleteButtons = screen.getAllByRole('button', { name: '' }); // X buttons have no text
    fireEvent.click(deleteButtons[1]); // Click the second X button
    
    // Check if the notification is removed
    const remainingNotifications = screen.getAllByText(/TechCorp|GlobalTech|Meeting/i).length;
    expect(remainingNotifications).toBeLessThan(initialNotifications);
  });
  
  it('registers socket event listeners on mount', () => {
    render(<RealTimeNotifications />);
    
    // Check if the socket event listeners are registered
    expect(mockOn).toHaveBeenCalledWith('notification', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('notification_update', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('notification_delete', expect.any(Function));
  });
  
  it('removes socket event listeners on unmount', () => {
    const { unmount } = render(<RealTimeNotifications />);
    
    // Unmount the component
    unmount();
    
    // Check if the socket event listeners are removed
    expect(mockOff).toHaveBeenCalledWith('notification');
    expect(mockOff).toHaveBeenCalledWith('notification_update');
    expect(mockOff).toHaveBeenCalledWith('notification_delete');
  });
});
