// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Improve fetch mock to better match Response interface
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    type: 'basic',
    url: '',
    json: () => Promise.resolve({}),
  })
);

// Improved Chart.js mock
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  registerables: [],
  register: jest.fn(),
  Line: jest.fn(),
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Filler: jest.fn(),
}));

// Mock Next.js components
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {}
  })
}));

// Mock react-chartjs-2 components
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
  Pie: () => null,
  Doughnut: () => null,
}));

// Suppress React act() warnings in tests
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

// Suppress console.log in tests unless explicitly enabled
const originalLog = console.log;
console.log = (...args) => {
  if (process.env.DEBUG_TESTS === 'true') {
    originalLog.call(console, ...args);
  }
};
