import { useState } from 'react';

/**
 * BUGGY COMPONENT TEMPLATE
 *
 * Replace this with your actual buggy implementation.
 * Add comments explaining what's wrong and why it's wrong.
 * Demonstrate the anti-pattern/bug clearly.
 */

export const BuggyComponent = () => {
  // TODO: Add your buggy implementation here
  // This version should contain the issue the task is teaching.

  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #f44336' }}>
      <h2>Buggy Component</h2>
      <p>Current count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      {/* TODO: Replace with actual buggy implementation */}
    </div>
  );
};
