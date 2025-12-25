import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';
import { BuggyComponent } from '../buggy/Component';
import { FixedComponent } from '../fixed/Component';

test('registers benchmark test file', () => {
  expect(true).toBe(true);
});

type MockUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// Mock user data (names must exactly match rendered text)
const mockUsers: Record<number, MockUser> = {
  1: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  2: { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  3: { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor' },
};

const createFetchMock = () =>
  vi.fn(async (input: RequestInfo | URL) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const match = url.match(/\/api\/users\/(\d+)$/);
    const userId = match ? Number(match[1]) : NaN;
    const user = mockUsers[userId];

    if (!user) {
      return {
        ok: false,
        json: async () => ({ message: 'User not found' }),
      } as Response;
    }

    return {
      ok: true,
      json: async () => user,
    } as Response;
  });

async function expectNameUpdatesOnUserIdChange(
  Component: ComponentType<{ userId: number }>
) {
  const { rerender } = render(<Component userId={1} />);

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: mockUsers[1].name })
    ).toBeInTheDocument();
  });

  rerender(<Component userId={2} />);

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: mockUsers[2].name })
    ).toBeInTheDocument();
  });
}

async function expectNameDoesNotUpdateOnUserIdChange(
  Component: ComponentType<{ userId: number }>
) {
  const { rerender } = render(<Component userId={1} />);

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: mockUsers[1].name })
    ).toBeInTheDocument();
  });

  rerender(<Component userId={2} />);

  await expect(
    waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: mockUsers[2].name })
        ).toBeInTheDocument();
      },
      { timeout: 200 }
    )
  ).rejects.toThrow();

  expect(
    screen.getByRole('heading', { name: mockUsers[1].name })
  ).toBeInTheDocument();
}

describe('Task 02: useEffect Missing Dependency', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', createFetchMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('BuggyUserProfile: rendered name does not change when userId changes', async () => {
    await expectNameDoesNotUpdateOnUserIdChange(BuggyComponent);
  });

  it('FixedUserProfile: rendered name changes when userId changes', async () => {
    await expectNameUpdatesOnUserIdChange(FixedComponent);
  });
});
