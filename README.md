# React Benchmark

A structured system for isolating, demonstrating, and learning React performance and behavioral issues through runnable code examples and comprehensive test suites.

## Purpose

This project serves as a reference implementation and learning tool for React developers. Each benchmark task isolates a specific problem pattern—performance anti-patterns, hook misuse, rendering inefficiencies, memory leaks—and demonstrates both the buggy code and the corrected implementation with accompanying tests.

The goal is to:

- Build intuition around React rendering mechanics and performance characteristics
- Provide reproducible examples of common mistakes and their solutions
- Enable systematic testing and validation of fixes
- Scale from a handful of examples to hundreds of benchmarking scenarios
- Serve as a training resource and architectural reference

## Benchmark Task Structure

Each task is an independent, self-contained unit that focuses on a single problem. The structure ensures consistency and scalability:

- **Task Naming**: `task-N-feature-name` where N is a task number (optionally zero-padded) and the feature name describes the problem in kebab-case
- **Fixed Directory Layout**: Every task contains the same four components—buggy implementation, fixed implementation, test suite, and documentation
- **One Problem Per Task**: Each task isolates a single issue to keep scope manageable and learning focused
- **Numbering Strategy**: Tasks are numbered with gaps to allow insertion of new tasks without renumbering existing ones

This structure enables the benchmark to scale from a handful of tasks to hundreds while maintaining clarity and consistency. Each task is a complete unit that can be studied, tested, and understood independently.

## Project Structure

The project is organized around **benchmark tasks**, each representing a single, well-defined problem.

### Task Organization

```
src/tasks/
├── task-01-memo-optimization/
│   ├── buggy/Component.tsx              # Problematic implementation
│   ├── fixed/Component.tsx              # Corrected implementation
│   ├── tests/Component.test.tsx         # Validation tests
│   └── README.md                        # Problem explanation & learning notes
├── task-02-useeffect-stale-dependency/
│   └── (same structure)
├── task-03-async-race-condition/
│   └── (same structure)
├── task-04-debounce-and-cancellation/
│   └── (same structure)
└── task-0X-feature-name/
    └── (same structure)
```

### Naming Convention

Tasks follow the pattern: `task-N-feature-name`

- **N**: Task number (e.g. 1, 01, 10, 100)
- **feature-name**: Kebab-case description of the problem

Example: `task-01-memo-optimization`, `task-02-useeffect-stale-dependency`, `task-03-async-race-condition`, `task-04-debounce-and-cancellation`

### Inside Each Task

**buggy/Component.tsx**
- Original buggy implementation with inline comments highlighting the issue
- Realistic code patterns that developers actually write
- Demonstrates the problem clearly

**fixed/Component.tsx**
- Corrected implementation with comments explaining the fix
- Follows React best practices
- Same functionality as buggy version, but correct

**tests/Component.test.tsx**
- Unit tests verifying both versions
- Demonstrates that the bug exists in the buggy version
- Validates that the fix resolves the issue
- Covers edge cases

**README.md**
- Detailed explanation of the bug and its impact
- Why the issue occurs (React mechanics involved)
- How the fix works
- Key takeaways for learning

### Shared Utilities

## Understanding Buggy vs Fixed vs Tests

### buggy/Component.tsx

The buggy implementation contains the problematic code you'll encounter in real applications. It includes inline comments that clearly mark the issue and explain why it's a problem. The goal is not to obscure the bug, but to create realistic code that illustrates common mistakes developers make. Each buggy component is focused on a single, well-defined problem to keep the learning scope manageable.

### fixed/Component.tsx

The fixed implementation shows the corrected version of the same component. Comments explain what changed and why the fix resolves the issue. The fixed version follows React best practices and maintains identical functionality to the buggy version—the only difference is that it works correctly.

### tests/Component.test.tsx

Tests validate both implementations:
- They verify that the buggy version exhibits the expected problem
- They confirm that the fixed version resolves the issue
- They cover edge cases and ensure the fix is robust

Tests are the specification: they define what the problem is and what correctness looks like.

## Tasks

Each task lives under `src/tasks/task-0X-*/` and includes:
- `buggy/Component.tsx`
- `fixed/Component.tsx`
- `tests/Component.test.tsx`

### Task 01: Memo Optimization

**Problem description**
- A parent component passes a callback to a memoized child.
- The callback is recreated on every parent render, so the memoized child re-renders even when its “meaning” didn’t change.

**Buggy behavior**
- Updating an unrelated parent state (like a counter) still re-renders the expensive/memoized child.
- You’ll typically observe extra logs / work that shouldn’t happen.

**Fix / solution**
- Keep the callback reference stable (e.g. `useCallback`) and ensure memoization boundaries are effective.

**What this demonstrates**
- Referential equality matters for `React.memo`.
- Performance bugs can be “invisible” in UI but obvious in render frequency.

### Task 02: useEffect Stale Dependency

**Problem description**
- A component fetches data in `useEffect` but forgets a dependency.
- When `userId` changes, the effect doesn’t re-run, so the UI shows stale data.

**Buggy behavior**
- Initial user loads correctly.
- Changing `userId` does not update the displayed user.

**Fix / solution**
- Include the changing value (e.g. `userId`) in the dependency array so the effect re-runs for new inputs.

**What this demonstrates**
- Missing dependencies create silent correctness bugs.
- Effects should be modeled as “sync state with inputs,” not “run once.”

### Task 03: Async Race Condition

**Problem description**
- The component fetches user data based on `userId`.
- When `userId` changes quickly, multiple requests are in flight.
- Responses can arrive out of order.

**Buggy behavior**
- A slower, older request can resolve after a faster, newer request.
- The older response overwrites state, so the UI shows the wrong user.

**Fix / solution**
- Cancel stale requests (commonly with `AbortController` in effect cleanup).
- Treat aborts as expected and don’t surface them as “real errors.”

**What this demonstrates**
- Correctness under concurrency: “latest input wins.”
- Cleanup functions are essential for safe async effects.

### Task 04: Debounce & Cancellation

**Problem description**
- A search box triggers an async fetch based on typed input.
- Without debouncing and cancellation/guarding, fast typing causes many requests and stale UI.

**Buggy behavior**
- Fetch runs on every keystroke.
- A slower response for an older query can overwrite results for the latest query.

**Fix / solution**
- Debounce input (e.g. 300ms) before firing requests.
- Cancel or ignore stale requests so only the latest query can update the UI.

**What this demonstrates**
- Debounce reduces network chatter; cancellation/guards preserve correctness.
- Timing-dependent bugs are testable with fake timers.

## Running Tests

### Run All Tests

```bash
npm test
```

Runs the full test suite against all task implementations.

### Run Tests for Specific Tasks

```bash
npx vitest run src/tasks/task-01-memo-optimization/tests/Component.test.tsx
```

Runs tests for a specific task test file.

### Interactive Test UI

```bash
npm test:ui
```

Opens Vitest's interactive UI for exploring test results and debugging.

### Development Server

```bash
npm run dev
```

Starts a Vite dev server with HMR. Navigate to `src/App.tsx` to browse available benchmarks.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling and dev server
- **Vitest** for unit testing
- **Testing Library** for component testing
- **ESLint** with TypeScript support

## Extending the Project

### Adding a New Task

1. **Copy the template folder**:
   - Duplicate `src/tasks/Template/`
   - Rename it to `src/tasks/task-0X-your-task-name/`
   - Update `meta.json` and `README.md` inside the new task folder

2. **Implement the buggy version** (`buggy/Component.tsx`):
   - Write code that exhibits the problem
   - Add comments explaining the bug
   - Keep it focused on a single issue

3. **Implement the fixed version** (`fixed/Component.tsx`):
   - Correct the implementation
   - Comment the changes and explain why they work
   - Maintain the same external interface as the buggy version

4. **Write comprehensive tests** (`tests/Component.test.tsx`):
   - Test both buggy and fixed versions
   - Demonstrate the problem exists in the buggy version
   - Verify the fix works
   - Include edge cases

5. **Document the task** (`README.md`):
   - Explain the bug clearly with examples
   - Describe the impact (performance, correctness, etc.)
   - Explain the solution and why it works
   - Provide learning takeaways

### Choosing Task Numbers

Plan your task numbering strategically to leave room for insertion:

- **001-010**: React fundamentals (state, props, lifecycle)
- **011-020**: Common hooks (useState, useEffect, useContext)
- **021-030**: Performance optimization (memo, callback, useMemo)
- **031-040**: List rendering and keys
- **041-050**: Event handling and closures
- **051-060**: Memory leaks and cleanup

## Why Consistency Matters for Benchmark Evaluation

A benchmark system only provides reliable data when its structure and methodology are consistent. This project maintains strict consistency at multiple levels:

### Structural Consistency

Every task follows the same directory layout and file naming conventions. This uniformity allows you to:

- **Compare apples to apples**: Each buggy/fixed pair demonstrates the same pattern of problem and solution
- **Automate analysis**: Consistent structure enables scripting, test runners, and analysis tools that operate across all tasks
- **Scale without degradation**: Adding the 50th task is as straightforward as adding the 5th because the structure never changes
- **Reduce cognitive overhead**: You always know where to find the buggy implementation, the tests, and the documentation

### Problem Isolation

Each task contains exactly one problem. This prevents confounding factors:

- **Single variable per benchmark**: When a task has one issue, you can measure the impact of that specific problem
- **Clear causation**: Fixed results improve predictably because only the identified issue changed
- **Replicable patterns**: Future developers can reproduce the same problem independently because it's clearly defined

### Test Specification

Tests define the problem formally. This creates an objective benchmark:

- **Tests are the source of truth**: What the tests verify is what the task demonstrates
- **Reproducibility**: Tests can be run identically across environments and time
- **Objective pass/fail**: No ambiguity about whether a fix is correct

### Numbering Discipline

The task numbering scheme (with gaps by design) maintains order and allows growth:

- **Easy to reference**: `task-015-use-state-batching` is self-explanatory
- **Room to grow**: New tasks can be inserted without renumbering existing ones
- **Logical progression**: Lower numbers typically cover fundamentals; higher numbers cover advanced patterns
- **No arbitrary reorganization**: Once a task has a number, it stays stable

### How This Enables Reliable Benchmarking

Without consistency:

- ❌ Different tasks might test different aspects at different scales
- ❌ You'd have no way to compare performance improvements across tasks
- ❌ Adding new tasks would introduce format variations that make automated analysis difficult
- ❌ Results would be hard to replicate or validate

With consistency:

- ✅ Each task measures a discrete, identifiable problem
- ✅ Results are comparable across the benchmark suite
- ✅ Automated tooling can process all tasks uniformly
- ✅ Results are verifiable and reproducible

The consistency standards in this project aren't arbitrary—they serve the purpose of creating a reliable, scalable benchmarking system where the signal isn't buried by noise.
- **061-070**: Advanced hooks and patterns
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
