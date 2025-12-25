import { describe, it, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuggyComponent } from '../buggy/Component';
import { FixedComponent } from '../fixed/Component';

test('registers tests correctly', () => {
  expect(true).toBe(true);
});

describe('Task 001: Memo Optimization', () => {
  describe('Buggy Component - unnecessarily re-renders expensive child on every parent update', () => {
    it('should render the component', () => {
      render(<BuggyComponent />);
      expect(screen.getByText(/Memo Optimization - Buggy/i)).toBeInTheDocument();
    });

    it('buggy: re-renders expensive child when parent count increases', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      render(<BuggyComponent />);

      consoleSpy.mockClear();

      // Don't rely on button text; pick the first button in this component (Increment Count)
      const incrementButton = screen.getAllByRole('button')[0];
      await userEvent.click(incrementButton);

      // Prove the click triggered a parent re-render
      expect(screen.getByText(/Count:\s*1/i)).toBeInTheDocument();

      // BUG: The child component re-renders even though its props haven't changed
      // This wastes CPU on expensive computations
      expect(consoleSpy).toHaveBeenCalledWith('ExpensiveChild re-rendered');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Fixed Component - skips expensive child re-render when props unchanged', () => {
    it('should render the component', () => {
      render(<FixedComponent />);
      expect(screen.getByText(/Memo Optimization - Fixed/i)).toBeInTheDocument();
    });

    it('passes: expensive child skips re-render when props do not change', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      render(<FixedComponent />);

      consoleSpy.mockClear();

      // Don't rely on button text; pick the first button in this component (Increment Count)
      const incrementButton = screen.getAllByRole('button')[0];
      await userEvent.click(incrementButton);

      // Prove the click triggered a parent re-render
      expect(screen.getByText(/Count:\s*1/i)).toBeInTheDocument();

      // The expensive child component should NOT re-render because its props
      // (via the stable handleClick callback) remain unchanged
      expect(consoleSpy).not.toHaveBeenCalledWith('ExpensiveChild re-rendered (fixed)');
      
      // UI still works correctly
      expect(screen.getByRole('button', { name: /Child Button/i })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
