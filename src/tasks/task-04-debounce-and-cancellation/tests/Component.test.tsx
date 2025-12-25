import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { BuggyComponent } from '../buggy/Component';
import { FixedComponent } from '../fixed/Component';

test('registers benchmark test file', () => {
  expect(true).toBe(true);
});

type FetchDelayMap = Record<string, number>;

function createSearchFetchMock(delaysMs: FetchDelayMap) {
  return vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const parsed = new URL(url, 'http://localhost');
    const query = parsed.searchParams.get('q') ?? '';
    const delay = delaysMs[query] ?? 0;

    const response: Response = {
      ok: true,
      json: async () => ({
        query,
        items: [`${query}-1`, `${query}-2`],
      }),
    } as Response;

    const signal = init?.signal;

    return new Promise<Response>((resolve, reject) => {
      const timeoutId = setTimeout(() => resolve(response), delay);

      // Allow cancellation if supported
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
}

async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

describe('Task 004: Debounce and Cancellation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('BuggyComponent: fetches on every keystroke and can show stale results', async () => {
    // Make the older query slower so it resolves last
    const fetchMock = createSearchFetchMock({ a: 100, ab: 10 });
    vi.stubGlobal('fetch', fetchMock);

    render(<BuggyComponent />);

    const input = screen.getByRole('textbox', { name: /search/i });

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });

    // Let effects schedule fetch requests
    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Fast response for "ab" arrives first
    await advance(10);
    expect(screen.getByRole('heading', { name: 'Results for "ab"' })).toBeInTheDocument();

    // Slow response for "a" arrives later and overwrites the UI (bug)
    await advance(90);
    expect(screen.getByRole('heading', { name: 'Results for "a"' })).toBeInTheDocument();
  });

  it('FixedComponent: debounces input and shows only the latest results', async () => {
    const fetchMock = createSearchFetchMock({ ab: 10 });
    vi.stubGlobal('fetch', fetchMock);

    render(<FixedComponent />);

    const input = screen.getByRole('textbox', { name: /search/i });

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });

    // Let the debounce timer be scheduled
    await act(async () => {});

    // Debounce prevents immediate requests
    expect(fetchMock).toHaveBeenCalledTimes(0);

    await advance(299);
    expect(fetchMock).toHaveBeenCalledTimes(0);

    await advance(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Response resolves
    await advance(10);
    expect(screen.getByRole('heading', { name: 'Results for "ab"' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Results for "a"' })).not.toBeInTheDocument();
  });

  it('FixedComponent: older requests cannot overwrite newer results', async () => {
    // First query is slow, second is fast
    const fetchMock = createSearchFetchMock({ a: 100, ab: 10 });
    vi.stubGlobal('fetch', fetchMock);

    render(<FixedComponent />);

    const input = screen.getByRole('textbox', { name: /search/i });

    // Type "a" and wait long enough to trigger first debounced request
    fireEvent.change(input, { target: { value: 'a' } });
    await act(async () => {});
    await advance(300);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Now type "b" and trigger a new request
    fireEvent.change(input, { target: { value: 'ab' } });
    await act(async () => {});
    await advance(300);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Fast response "ab" resolves
    await advance(10);
    expect(screen.getByRole('heading', { name: 'Results for "ab"' })).toBeInTheDocument();

    // Even when the old request would resolve later, UI must remain on latest
    await advance(200);
    expect(screen.getByRole('heading', { name: 'Results for "ab"' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Results for "a"' })).not.toBeInTheDocument();
  });
});
