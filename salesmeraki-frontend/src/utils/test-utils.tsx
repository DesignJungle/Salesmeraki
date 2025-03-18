import React from 'react';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Mock fetch if not already mocked
if (!global.fetch) {
  global.fetch = jest.fn(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;
}

// Add a proper mock session
const mockSession = {
  expires: '1',
  user: { name: 'Test User', email: 'test@example.com' }
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={mockSession}>
      {children}
    </SessionProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };