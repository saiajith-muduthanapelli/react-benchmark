import { useEffect, useState } from 'react';

/**
 * BUGGY COMPONENT
 * 
 * BUG: Missing dependency in useEffect
 * 
 * The useEffect dependency array is empty [], meaning it only runs once on mount.
 * When the userId prop changes, the effect doesn't re-run, so the component
 * continues to display the old user's data.
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

export const BuggyUserProfile = ({ userId }: UserProfileProps) => {
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
  }, []); // BUG: Missing userId in dependency array

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

export { BuggyUserProfile as BuggyComponent };
