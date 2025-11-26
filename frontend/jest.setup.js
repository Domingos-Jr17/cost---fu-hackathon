import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock PWA APIs for testing
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock IndexedDB for PWA offline testing
const indexedDB = {
  open: jest.fn(() => Promise.resolve({
    createObjectStore: jest.fn(),
    transaction: jest.fn(),
  })),
};

global.indexedDB = indexedDB;

// Mock Service Worker APIs
global.navigator = {
  serviceWorker: {
    register: jest.fn(() => Promise.resolve()),
    ready: Promise.resolve(),
  },
};

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;