import { useState, useEffect } from 'react';

/**
 * FIXED COMPONENT
 * 
 * FIX: Uses AbortController to cancel stale requests
 * 
 * When userId changes, the previous request is cancelled before it can
 * set state. This ensures only the most recent request's response updates
 * the component, eliminating the race condition.
 */

export interface User {
  id: number;
  name: string;
  email: string;
  bio: string;
}

interface UserProfileProps {
  userId: number;
}

const fetchUserProfile = async (userId: number, signal: AbortSignal): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`, { signal });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return (await response.json()) as User;
};

export const FixedUserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);
    setError(null);

    fetchUserProfile(userId, abortController.signal)
      .then((userData) => {
        // Only update state if this request wasn't aborted
        setUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        // Ignore abort errors (they mean a newer request is in progress)
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message);
        setLoading(false);
      });

    // FIX: Cleanup function cancels the pending request when dependencies change
    return () => {
      abortController.abort();
    };
  }, [userId]);

  if (loading) {
    return <div className="profile">Loading user {userId}...</div>;
  }

  if (error) {
    return <div className="profile error">Error: {error}</div>;
  }

  if (!user) {
    return <div className="profile">No user selected</div>;
  }

  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p className="user-id">ID: {user.id}</p>
      <p className="email">Email: {user.email}</p>
      <p className="bio">Bio: {user.bio}</p>
    </div>
  );
};

export { FixedUserProfile as FixedComponent };
