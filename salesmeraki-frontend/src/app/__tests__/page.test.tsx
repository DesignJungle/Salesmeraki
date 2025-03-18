import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { name: 'Test User' } },
    status: 'authenticated',
  }),
}));

describe('Home', () => {
  it('renders the home page', () => {
    render(<Home />);
    
    // Check for any text that actually exists on the page
    // Replace this with text that actually exists in your Home component
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    // Or use a more generic assertion:
    expect(document.querySelector('h1')).toBeInTheDocument();
  });
});
