import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Button Component', () => {
  beforeEach(() => {
    // Clear all DOM mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Click me');
    });

    it('renders with custom variant', () => {
      render(<Button variant="destructive">Delete</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveClass('bg-destructive');
      expect(buttonElement).toHaveTextContent('Delete');
    });

    it('renders with custom size', () => {
      render(<Button size="lg">Large Button</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveClass('h-11', 'rounded-md', 'px-8');
    });

    it('renders as custom element when asChild is true', () => {
      render(
        <Button asChild>
          <span data-testid="custom-child">Custom Content</span>
        </Button>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveClass('custom-class');
    });
  });

  describe('User Interaction', () => {
    it('handles click events', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const buttonElement = screen.getByRole('button');

      // Test with fireEvent
      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Reset mocks
      jest.clearAllMocks();
      render(<Button onClick={handleClick}>Click me</Button>);
      const newButtonElement = screen.getByRole('button');

      // Test with userEvent (recommended for better UX simulation)
      await userEvent.click(newButtonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when onClick is not provided', () => {
      render(<Button>Cannot Click</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('can be focused with keyboard', async () => {
      render(<Button>Focus me</Button>);

      const buttonElement = screen.getByRole('button');

      // Test keyboard navigation
      buttonElement.focus();
      expect(buttonElement).toHaveFocus();

      // Test keyboard interaction
      fireEvent.keyDown(buttonElement, { key: 'Enter' });
      fireEvent.keyDown(buttonElement, { key: ' ' });

      const handleClick = jest.fn();
      const clickableButton = screen.getByRole('button', { name: 'Focus me' });
      clickableButton.onclick = handleClick;

      await userEvent.keyboard('[Enter]');
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button aria-label="Custom action">Action</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveAttribute('aria-label', 'Custom action');
    });

    it('is accessible via screen reader', () => {
      render(<Button>Submit Form</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();

      // Test screen reader announcement
      expect(buttonElement).toHaveAccessibleDescription();
    });

    it('supports keyboard navigation', () => {
      render(<Button>Tab to me</Button>);

      const buttonElement = screen.getByRole('button');

      // Test tab navigation
      document.body.appendChild(buttonElement);
      buttonElement.focus();

      fireEvent.keyDown(document.body, { key: 'Tab' });

      await waitFor(() => {
        expect(buttonElement).toHaveFocus();
      });
    });

    it('has proper color contrast', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const buttonElement = screen.getByRole('button');
      const styles = window.getComputedStyle(buttonElement);

      // Test color contrast (basic check)
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;

      // Ensure colors are not empty
      expect(backgroundColor).toBeTruthy();
      expect(color).toBeTruthy();

      // Test for contrast issues (simplified)
      expect(backgroundColor).not.toBe('rgba(128, 128, 128, 1)');
      expect(color).not.toBe('rgba(128, 128, 128, 1)');
    });
  });

  describe('PWA Integration', () => {
    beforeEach(() => {
      // Mock PWA install prompt
      window.matchMedia = jest.fn(() => ({
        matches: true,
      addListener: jest.fn(),
        removeListener: jest.fn(),
      }));
    });

    it('shows PWA install prompt in standalone mode', async () => {
      // Mock PWA environment
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({
          matches: false, // Not in standalone mode
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
      });

      render(<Button>Install App</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();

      // In a real PWA, this would trigger install prompt
      expect(window.matchMedia).toHaveBeenCalledWith('(display-mode: standalone)');
    });

    it('works offline', () => {
      // Mock offline status
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
      });

      render(<Button offline={true}>Offline Action</Button>);

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveAttribute('data-offline', 'true');
    });
  });
});