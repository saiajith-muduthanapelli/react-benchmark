import { useState } from 'react';

/**
 * FIXED COMPONENT TEMPLATE
 * 
 * Replace this with your actual fixed implementation.
 * Add comments explaining how the fix resolves the bug from the buggy version.
 * Demonstrate the best practice approach.
 */

export const FixedComponent = () => {
  // TODO: Add your fixed implementation here
  // This version should resolve the issues present in the buggy version.
  // Use best practices for React development.

  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #4caf50' }}>
      <h2>Fixed Component</h2>
      <p>Current count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      {/* TODO: Replace with actual fixed implementation */}
    </div>
  );
};
