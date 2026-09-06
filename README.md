# JavaScript Interview Prep

This project is organized as an interview-preparation notebook for JavaScript and frontend roles.

## How to Use

Start with [JavaScript Runtime: Interview Notes](01-js-fundamentals/javascript-runtime.md), including expandable answers, output exercises, and a revision checklist.

Next, study [Call Stack: Interview Notes](01-js-fundamentals/call-stack.md) before the event loop. Practice stack traces, synchronous calls, recursion, and error unwinding.

Topic 3 is [Browser APIs / Web APIs](04-async-browser-web/browser-web-apis.md): timers, DOM events, fetch, and the browser's responsibilities.

Topic 4 is [Synchronous vs Asynchronous JavaScript](04-async-browser-web/synchronous-vs-asynchronous.md): blocking, non-blocking behavior, callbacks, and result handling before queues.

Topic 5 is [Macrotask Queue / Task Queue](04-async-browser-web/macrotask-queue.md): task sources, timer scheduling, DOM events, and why zero delay is not immediate.

Topic 6 is [Microtask Queue](04-async-browser-web/microtask-queue.md): promise reactions, queueMicrotask, priority, nested microtasks, and queue draining, with eleven output exercises.

Topic 7 is [Event Loop](04-async-browser-web/event-loop.md): combine the stack, host APIs, tasks, and microtasks through a complete scheduling walkthrough and five output exercises.

Topic 8 is [Promises and the Event Loop](04-async-browser-web/promises-and-event-loop.md): states, returned values and promises, error recovery, cleanup, and microtask ordering in chains.

Topic 9 is [queueMicrotask()](04-async-browser-web/queue-microtask.md): explicit scheduling, timing, promise comparisons, enqueue order, and practical batching.

Topic 10 is [setTimeout()](04-async-browser-web/set-timeout.md): timer lifecycle, delay guarantees, promise ordering, nested timers, cancellation, and host differences.

Topic 11 is [Microtask vs Macrotask](04-async-browser-web/microtask-vs-macrotask.md): a scheduling comparison table, DOM-event qualifications, and mixed output practice.

Open `index.html` in a browser, choose a topic from the dropdown, and check the browser console for the examples.

You can also run most standalone JavaScript files directly with Node.js:

```bash
node 01-js-fundamentals/closures.js
```

Browser-specific files such as DOM and Fetch API examples are better tested through `index.html`.

## Folder Structure

Topic filenames use lowercase words separated by hyphens. Keep each file focused on one concept, and preserve commented examples that demonstrate interview questions or intentional errors.

| Folder                        | Focus                                                                |
| ----------------------------- | -------------------------------------------------------------------- |
| `01-js-fundamentals`          | Core JavaScript concepts interviewers expect you to explain clearly. |
| `02-arrays-strings-iteration` | Arrays, strings, loops, iteration, and common method behavior.       |
| `03-objects-prototypes`       | Objects, prototypes, classes, references, equality, and copying.     |
| `04-async-browser-web`        | Callbacks, promises, event loop, fetch, DOM, and web APIs.           |
| `05-es6-advanced-patterns`    | Map, Set, Symbol, iterators, generators, currying, and memoization.  |
| `06-practice-output`          | Output-based interview questions and dry-run practice.               |
| `99-misc`                     | Scratch notes or files that do not belong to a main topic yet.       |
| `scripts`                     | Development checks for the notebook.                                 |

## Maintenance

Install the development tools once with `npm install`, then use:

```bash
npm run format
npm run format:check
npm run check
```

The syntax check parses every topic file without executing it. It does not validate expected output or execute commented exercises. Some examples intentionally demonstrate errors or depend on browser globals such as `window`; run those individually through `index.html`.

## 4-Year Experience Preparation Order

1. Master `01-js-fundamentals`.
2. Practice output questions from `06-practice-output`.
3. Code polyfills and utilities using `02-arrays-strings-iteration`.
4. Revise object references, prototypes, and copying from `03-objects-prototypes`.
5. Deep-dive async JavaScript from `04-async-browser-web`.
6. Use `05-es6-advanced-patterns` for advanced discussion and follow-up questions.

## Suggested Next Files to Add

- `06-practice-output/debounce.js`
- `06-practice-output/throttle.js`
- `06-practice-output/deep-clone.js`
- `06-practice-output/promise-all.js`
- `06-practice-output/flatten-array.js`
- `06-practice-output/group-by.js`
- `06-practice-output/lru-cache.js`
