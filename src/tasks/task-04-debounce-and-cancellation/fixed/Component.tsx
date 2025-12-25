import { useEffect, useRef, useState } from 'react';

type SearchResponse = {
  query: string;
  items: string[];
};

/**
 * FIXED COMPONENT
 *
 * Fixes:
 * - Debounces user input (300ms)
 * - Cancels in-flight requests via AbortController
 * - Guards against stale async updates with a request id
 */
export function FixedComponent() {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [resultQuery, setResultQuery] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>([]);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResultQuery(null);
      setItems([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return (await res.json()) as SearchResponse;
      })
      .then((data) => {
        // Guard: only the latest request can update state
        if (requestId !== requestIdRef.current) {
          return;
        }
        setResultQuery(data.query);
        setItems(data.items);
      })
      .catch((err: unknown) => {
        // Ignore abort errors (they mean a newer request is in progress)
        if (err && typeof err === 'object' && 'name' in err && (err as any).name === 'AbortError') {
          return;
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        setResultQuery(null);
        setItems([]);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return (
    <div>
      <h2>Debounce + Cancellation - Fixed</h2>

      <label>
        Search
        <input
          aria-label="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type to search"
        />
      </label>

      {loading ? <div role="status">Loading…</div> : null}

      {resultQuery ? (
        <div>
          <h3>{`Results for \"${resultQuery}\"`}</h3>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No results</div>
      )}
    </div>
  );
}
