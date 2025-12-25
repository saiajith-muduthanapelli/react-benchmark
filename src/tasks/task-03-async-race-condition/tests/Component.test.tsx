import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { BuggyComponent } from '../buggy/Component';
import { FixedComponent } from '../fixed/Component';

test('registers benchmark test file', () => {
  expect(true).toBe(true);
});

describe('Task 003: Async Race Condition', () => {
  const mockUsers = {
    1: {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      bio: 'Senior Engineer',
    },
    2: {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      bio: 'Product Manager',
    },
    3: {
      id: 3,
      name: 'Carol White',
      email: 'carol@example.com',
      bio: 'Design Lead',
    },
  };

  const createFetchMock = (delaysMs: Record<number, number>) =>
    vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      const match = url.match(/\/api\/users\/(\d+)$/);
      const userId = match ? Number(match[1]) : NaN;
      const user = mockUsers[userId as keyof typeof mockUsers];
      const delay = delaysMs[userId] ?? 0;

      const response: Response = {
        ok: Boolean(user),
        json: async () => {
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        },
      } as Response;

      const signal = init?.signal;

      return new Promise<Response>((resolve, reject) => {
        const timeoutId = setTimeout(() => resolve(response), delay);

        if (signal) {
          if (signal.aborted) {
            clearTimeout(timeoutId);
            const abortError = new Error('Aborted');
            (abortError as any).name = 'AbortError';
            reject(abortError);
            return;
          }

          signal.addEventListener(
            'abort',
            () => {
              clearTimeout(timeoutId);
              const abortError = new Error('Aborted');
              (abortError as any).name = 'AbortError';
              reject(abortError);
            },
            { once: true }
          );
        }
      });
    });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const advance = async (ms: number) => {
    await act(async () => {
      vi.advanceTimersByTime(ms);
    });
  };

  it('BuggyUserProfile: older (slower) response wins and shows the wrong user', async () => {
    // userId=1 resolves slower than userId=2
    vi.stubGlobal('fetch', createFetchMock({ 1: 100, 2: 10 }));

    const { rerender } = render(<BuggyComponent userId={1} />);

    // Ensure the initial effect runs (request starts), but do not let it resolve
    await act(async () => {});

    // Immediately switch before the first request resolves
    rerender(<BuggyComponent userId={2} />);
    await act(async () => {});

    // Fast response arrives first: UI briefly shows user 2
    await advance(10);
    expect(screen.getByRole('heading', { name: mockUsers[2].name })).toBeInTheDocument();

    // Slow response arrives later and incorrectly overwrites the UI with user 1
    await advance(90);
    expect(screen.getByRole('heading', { name: mockUsers[1].name })).toBeInTheDocument();
  });

  it('FixedUserProfile: latest (faster) response wins and shows the correct user', async () => {
    vi.stubGlobal('fetch', createFetchMock({ 1: 100, 2: 10 }));

    const { rerender } = render(<FixedComponent userId={1} />);

    // Ensure the initial effect runs (request starts), but do not let it resolve
    await act(async () => {});

    // Immediately switch before the first request resolves
    rerender(<FixedComponent userId={2} />);
    await act(async () => {});

    // Fast response arrives first: UI shows user 2
    await advance(10);
    expect(screen.getByRole('heading', { name: mockUsers[2].name })).toBeInTheDocument();

    // Slow response for user 1 arrives later but must be ignored (aborted)
    await advance(90);
    expect(screen.getByRole('heading', { name: mockUsers[2].name })).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: mockUsers[1].name })
    ).not.toBeInTheDocument();
  });
});
