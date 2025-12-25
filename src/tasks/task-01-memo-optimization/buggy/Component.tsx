import { useState } from 'react';

/**
 * BUGGY COMPONENT
 * 
 * BUG: The handleClick function is recreated on every render,
 * causing unnecessary re-renders of the ExpensiveChild component.
 */

interface ChildProps {
  onClick: () => void;
}

const ExpensiveChild = ({ onClick }: ChildProps) => {
  console.log('ExpensiveChild re-rendered');
  return <button onClick={onClick}>Child Button</button>;
};

export const BuggyMemoComponent = () => {
  const [count, setCount] = useState(0);

  // BUG: This function is redefined on every render
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <div>
      <h2>Memo Optimization - Buggy Version</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
};

export { BuggyMemoComponent as BuggyComponent };
