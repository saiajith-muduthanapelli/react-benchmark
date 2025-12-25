# React Benchmark – Real-World Bugs & Fixes

This repository contains a set of focused React benchmark tasks that demonstrate real-world frontend bugs and their correct fixes, validated using automated tests.

Instead of building a full app, this project isolates common failure modes in React—performance issues, stale state, and async correctness—and shows how to fix them intentionally and testably.

## Why this project?

Many React issues only appear in production:

- Unnecessary re-renders
- Stale closures
- Async race conditions
- Over-fetching due to user input

This project demonstrates how those bugs happen and how to fix them properly, with tests that prove the behavior change.

## Project Structure

```
src/
  tasks/
    task-01-memo-optimization/
    task-02-useeffect-stale-dependency/
    task-03-async-race-condition/
    task-04-debounce-and-cancellation/
```

Each task follows the same structure:

```
task-XX-*/
  buggy/Component.tsx        // Demonstrates the bug
  fixed/Component.tsx        // Correct implementation
  tests/Component.test.tsx   // Tests that prove the bug and the fix
```

## Tasks Overview

### Task 01: Memo Optimization

**Problem:**
An expensive child component re-renders unnecessarily whenever the parent state updates.

**Buggy behavior:**
- Child re-renders on every parent update
- Wastes CPU on expensive computations

**Fix:**
- Used `React.memo` and `useCallback`
- Child only re-renders when its props actually change

**What this demonstrates:**
- React render behavior
- Memoization and performance optimization
- Preventing unnecessary re-renders

### Task 02: useEffect Stale Dependency

**Problem:**
Component does not update correctly when props change due to missing dependencies in `useEffect`.

**Buggy behavior:**
- UI shows stale data
- Effect does not re-run when expected

**Fix:**
- Correct dependency array usage
- Ensured state updates reflect latest props

**What this demonstrates:**
- Stale closures
- Correct `useEffect` dependency management

### Task 03: Async Race Condition

**Problem:**
Multiple async requests race, allowing older (slower) responses to overwrite newer state.

**Buggy behavior:**
- UI shows incorrect or outdated data
- Latest user action is ignored

**Fix:**
- Ensured only the latest async request updates state
- Prevented stale responses from winning

**What this demonstrates:**
- Async correctness
- Race condition handling in React

### Task 04: Debounce & Cancellation

**Problem:**
Search input fires requests on every keystroke and can display stale results.

**Buggy behavior:**
- Excessive network calls
- Older results overwrite newer input

**Fix:**
- Debounced user input
- Cancelled or ignored stale async requests
- Only latest user intent updates the UI

**What this demonstrates:**
- Debouncing
- Async cancellation
- Real-world search/input behavior

## Testing

All tasks are validated using Vitest and React Testing Library.

Run all tests:

```bash
npm install
npx vitest run
```

Expected result:

```
Test Files  4 passed
Tests       15 passed
```

## Key Takeaway

This project focuses on how React fails in real applications and how to fix those failures deliberately, with tests that prove the improvement.

It is intentionally task-based and minimal, prioritizing clarity over boilerplate.
- **071-100**: Complex scenarios and edge cases

This numbering allows you to insert new tasks between existing ones without renumbering.

### Best Practices for New Tasks

- **Focus**: Each task should illustrate one clear problem
- **Simplicity**: Keep components small and easy to understand (avoid unrelated complexity)
- **Comments**: Use clear, concise comments in code to highlight the bug and fix
- **Test Coverage**: Tests should fail for the buggy version and pass for the fixed version
- **Documentation**: README should be clear enough for a developer unfamiliar with the topic to understand the issue after reading it

## Development Workflow

1. Start the dev server: `npm run dev`
2. Create or edit task files in `src/tasks/`
3. Write tests in `tests/` subdirectory
4. Run tests frequently: `npm test` or `npm test:ui`
5. Verify lint rules: `npm run lint`
6. Build for production: `npm run build`

## Standards

- All components use TypeScript for type safety
- Components are functional components with hooks (no class components)
- Tests use Vitest and React Testing Library
- Code follows ESLint configuration defined in `eslint.config.js`
- Task numbering uses zero-padded three-digit format (001, 002, ..., 100)
