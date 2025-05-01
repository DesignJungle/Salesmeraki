import { renderHook, act } from '@testing-library/react';
import { useSocket } from './useSocket';
import { useSession } from 'next-auth/react';
import socketService from '@/services/socketService';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock socket service
jest.mock('@/services/socketService', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
}));

describe('useSocket', () => {
  const mockSession = {
    user: { name: 'Test User' },
    accessToken: 'mock-token',
  };
  
  const mockSocket = {
    id: 'socket-id',
    connected: true,
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });
    (socketService.connect as jest.Mock).mockResolvedValue(mockSocket);
  });

  it('connects to socket when session is available', async () => {
    const { result, rerender } = renderHook(() => useSocket());
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check if socket service connect was called with the token
    expect(socketService.connect).toHaveBeenCalledWith('mock-token');
    
    // Check if the hook returns the connected state
    expect(result.current.isConnected).toBe(true);
  });
  
  it('does not connect when session is not available', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    
    const { result } = renderHook(() => useSocket());
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check if socket service connect was not called
    expect(socketService.connect).not.toHaveBeenCalled();
    
    // Check if the hook returns the disconnected state
    expect(result.current.isConnected).toBe(false);
  });
  
  it('disconnects on unmount', async () => {
    const { unmount } = renderHook(() => useSocket());
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Unmount the hook
    unmount();
    
    // Check if socket service disconnect was called
    expect(socketService.disconnect).toHaveBeenCalled();
  });
  
  it('provides emit function that calls socket service', async () => {
    const { result } = renderHook(() => useSocket());
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Call the emit function
    act(() => {
      result.current.emit('test-event', { data: 'test' });
    });
    
    // Check if socket service emit was called with the correct arguments
    expect(socketService.emit).toHaveBeenCalledWith('test-event', { data: 'test' });
  });
  
  it('provides on function that calls socket service', async () => {
    const { result } = renderHook(() => useSocket());
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Create a mock callback
    const mockCallback = jest.fn();
    
    // Call the on function
    act(() => {
      result.current.on('test-event', mockCallback);
    });
    
    // Check if socket service on was called with the correct arguments
    expect(socketService.on).toHaveBeenCalledWith('test-event', mockCallback);
  });
  
  it('provides off function that calls socket service', async () => {
    const { result } = renderHook(() => useSocket());
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Create a mock callback
    const mockCallback = jest.fn();
    
    // Call the off function
    act(() => {
      result.current.off('test-event', mockCallback);
    });
    
    // Check if socket service off was called with the correct arguments
    expect(socketService.off).toHaveBeenCalledWith('test-event', mockCallback);
  });
  
  it('handles connection errors', async () => {
    const mockError = new Error('Connection failed');
    (socketService.connect as jest.Mock).mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useSocket());
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check if the hook returns the error
    expect(result.current.error).toBe(mockError);
    expect(result.current.isConnected).toBe(false);
  });
});
