import { useEffect, useState } from 'react';

type SearchResponse = {
  query: string;
  items: string[];
};

/**
 * BUGGY COMPONENT
 *
 * Problems:
 * - Triggers a fetch on every keystroke (no debounce)
 * - Does not cancel/ignore in-flight requests
 * - Allows slow, older responses to overwrite newer results
 */
export function BuggyComponent() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultQuery, setResultQuery] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResultQuery(null);
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return (await res.json()) as SearchResponse;
      })
      .then((data) => {
        // BUG: This can apply stale results if an older request resolves last
        setResultQuery(data.query);
        setItems(data.items);
      })
      .catch(() => {
        setResultQuery(null);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div>
      <h2>Debounce + Cancellation - Buggy</h2>

      <label>
        Search
        <input
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
