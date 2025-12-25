import { useState, useEffect } from 'react';

/**
 * BUGGY COMPONENT
 * 
 * BUG: Race condition in data fetching
 * 
 * When userId changes rapidly, the previous request may complete after
 * the new request has started. The old response then overwrites the new data,
 * displaying stale information for the currently selected user.
 * 
 * Scenario:
 * 1. Load user 1 (slow network)
 * 2. Quickly switch to user 2 (request starts)
 * 3. User 2 data loads first and is set
 * 4. User 1 data finally loads and overwrites user 2's data
 * 5. UI shows user 1's data when user 2 is selected
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

const fetchUserProfile = async (userId: number): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return (await response.json()) as User;
};

export const BuggyUserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // BUG: No cleanup or cancellation of previous requests
    fetchUserProfile(userId)
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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

export { BuggyUserProfile as BuggyComponent };
