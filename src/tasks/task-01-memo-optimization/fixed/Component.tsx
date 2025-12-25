import { useState, memo, useCallback } from 'react';

/**
 * FIXED COMPONENT
 * 
 * FIX: Uses memo() to prevent unnecessary re-renders of ExpensiveChild
 * and useCallback() to maintain referential equality of handleClick.
 */

interface ChildProps {
  onClick: () => void;
}

const ExpensiveChild = memo(({ onClick }: ChildProps) => {
  console.log('ExpensiveChild re-rendered (fixed)');
  return <button onClick={onClick}>Child Button</button>;
});

ExpensiveChild.displayName = 'ExpensiveChild';

export const FixedMemoComponent = () => {
  const [count, setCount] = useState(0);

  // FIX: useCallback ensures handleClick maintains the same reference across renders
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return (
    <div>
      <h2>Memo Optimization - Fixed Version</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
};

export { FixedMemoComponent as FixedComponent };
