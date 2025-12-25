import { useEffect, useState } from 'react';

/**
 * FIXED COMPONENT
 * 
 * FIX: Added userId to the dependency array
 * 
 * Now when userId changes, useEffect re-runs and fetches the new user's data.
 * The dependency array [userId] tells React: "run this effect whenever userId changes".
 */

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserProfileProps {
  userId: number;
}

export const FixedUserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();

        if (isMounted) {
          setUser(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [userId]); // FIX: Added userId dependency

  if (loading) return <div className="loading">Loading user profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="empty">No user data</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <div className="details">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
};

export { FixedUserProfile as FixedComponent };
