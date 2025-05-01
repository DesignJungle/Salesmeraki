import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from './page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock setTimeout to execute immediately
jest.useFakeTimers();

describe('ProfilePage', () => {
  const mockSession = {
    user: {
      name: 'Test User',
      email: 'test@example.com',
    },
  };
  
  const mockRouter = {
    push: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('shows loading state initially', () => {
    render(<ProfilePage />);
    
    // Check if loading text is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('redirects to sign in page if not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    
    render(<ProfilePage />);
    
    // Check if router.push was called with the sign in page
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
  });
  
  it('renders profile information after loading', async () => {
    render(<ProfilePage />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Check if the profile information is displayed
    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
    
    // Check if user data is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sales Representative')).toBeInTheDocument();
  });
  
  it('allows editing profile information', async () => {
    render(<ProfilePage />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Click on Edit Profile button
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Check if form fields are displayed
    const nameInput = screen.getByDisplayValue('Test User');
    const emailInput = screen.getByDisplayValue('test@example.com');
    
    // Edit the name field
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    // Save changes
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Fast-forward timers to complete saving
    jest.advanceTimersByTime(1000);
    
    // Check if success notification is displayed
    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
    });
  });
  
  it('switches to notifications tab when clicked', async () => {
    render(<ProfilePage />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Click on Notification Settings tab
    fireEvent.click(screen.getByText('Notification Settings'));
    
    // Check if notification preferences are displayed
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Browser Notifications')).toBeInTheDocument();
    expect(screen.getByText('Mobile Push Notifications')).toBeInTheDocument();
  });
  
  it('switches to security tab when clicked', async () => {
    render(<ProfilePage />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Click on Security tab
    fireEvent.click(screen.getByText('Security'));
    
    // Check if security settings are displayed
    expect(screen.getByText('Security Settings')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText('Login History')).toBeInTheDocument();
  });
  
  it('allows enabling two-factor authentication', async () => {
    render(<ProfilePage />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Click on Security tab
    fireEvent.click(screen.getByText('Security'));
    
    // Click on Enable 2FA button
    fireEvent.click(screen.getByText('Enable 2FA'));
    
    // Fast-forward timers to complete enabling 2FA
    jest.advanceTimersByTime(1000);
    
    // Check if success notification is displayed
    await waitFor(() => {
      expect(screen.getByText('Two-factor authentication enabled!')).toBeInTheDocument();
    });
  });
});
