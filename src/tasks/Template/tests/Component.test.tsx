import { describe, it, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BuggyComponent } from '../buggy/Component';
import { FixedComponent } from '../fixed/Component';

test('registers benchmark test file', () => {
	expect(true).toBe(true);
});

/**
 * TEMPLATE TEST SUITE
 *
 * Write tests that:
 * 1. Verify the buggy version exhibits the problem
 * 2. Verify the fixed version resolves it
 * 3. Test normal use cases
 * 4. Test edge cases
 * 5. Ensure both render correctly
 *
 * Guidelines:
 * - Use descriptive test names that explain what's being tested
 * - Test the problem explicitly (don't just test that it renders)
 * - Show the difference between buggy and fixed behavior
 */

describe('Template Task', () => {
	describe('Buggy Component', () => {
		it('should render without crashing', () => {
			render(<BuggyComponent />);
			expect(screen.getByText(/Buggy Component/i)).toBeInTheDocument();
		});

		// TODO: Add tests that demonstrate the bug
		// Example: Check for console.log calls, verify re-render behavior, etc.
	});

	describe('Fixed Component', () => {
		it('should render without crashing', () => {
			render(<FixedComponent />);
			expect(screen.getByText(/Fixed Component/i)).toBeInTheDocument();
		});

		// TODO: Add tests that verify the fix
		// Example: Verify expected behavior, check for proper optimization, etc.
	});
});
