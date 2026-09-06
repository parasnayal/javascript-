# JavaScript Runtime: Interview Notes

**Level:** Developer with 4 years of experience. **Study time:** 25-35 minutes.

Read the concepts, predict each output, then expand the answer. Explain answers aloud before checking them. Expandable sections work in Markdown viewers that support HTML details, including GitHub.

## 1. Your 30-Second Answer

> A JavaScript runtime is an environment that executes JavaScript and provides capabilities such as timers and I/O. The engine executes the language and manages memory; the surrounding runtime supplies APIs and scheduling. Browsers provide DOM access, while Node.js provides server and filesystem APIs. JavaScript runs one piece of code at a time on each execution thread, while the environment can coordinate asynchronous work.

## 2. Engine vs Runtime

| Term       | Responsibility                                   | Example                              |
| ---------- | ------------------------------------------------ | ------------------------------------ |
| Language   | Defines syntax, values, and standard behavior    | Functions, objects, `Promise`, `Map` |
| Engine     | Executes JavaScript and manages memory           | V8                                   |
| Runtime    | Combines an engine with host capabilities        | Chrome, Node.js                      |
| Call stack | Tracks active function calls; last in, first out | `main` calls `calculate`             |
| Heap       | Memory used for objects managed by the engine    | An object created with `{}`          |

The stack/heap picture is a useful simplification. Avoid claiming that every primitive must physically live on the stack; engines can optimize storage.

<details>
<summary>Interview question: Chrome and Node.js both use V8. Why does document work in only one?</summary>

`document` is supplied by the browser's DOM environment, not V8 or the JavaScript language. Node.js does not provide a browser DOM by default. A shared engine does not imply identical host APIs.

</details>

## 3. Browser vs Node.js

| Area             | Browser                            | Node.js                                    |
| ---------------- | ---------------------------------- | ------------------------------------------ |
| Typical work     | User interfaces                    | Servers, scripts, tools                    |
| Engine           | Depends on browser; Chrome uses V8 | V8                                         |
| Environment APIs | DOM, events, storage, networking   | Filesystem, networking, processes          |
| Scheduling       | Browser event loop and task queues | Event loop with phases, supported by libuv |
| Extra JS threads | Web Workers                        | Worker threads                             |

The runtime itself is not limited to one operating-system thread. Node.js uses OS facilities and a worker pool for appropriate operations; not every asynchronous operation gets its own thread.

## 4. Who Provides What?

Cover the second column and classify each item first.

| Feature                                   | Owner                                             |
| ----------------------------------------- | ------------------------------------------------- |
| `let`, functions, arrays, objects         | JavaScript language                               |
| `Promise`, `Map`, `Set`, `JSON`           | JavaScript standard                               |
| `document`, `localStorage`, DOM events    | Browser environment                               |
| `setTimeout`, `console`, `queueMicrotask` | Host APIs available in browsers and Node.js       |
| `fetch`                                   | Host API available in browsers and modern Node.js |
| `node:fs`, `process`                      | Node.js                                           |

<details>
<summary>Interview trap: If an API is globally available, is it part of JavaScript?</summary>

No. Hosts can expose global APIs. `setTimeout` is a good example. Distinguish the ECMAScript language from the environment that executes it.

</details>

## 5. Runtime Architecture

```text
Runtime
|
+-- JavaScript engine
|   +-- Call stack: code executing now
|   +-- Heap: managed object memory
|
+-- Host APIs: timers, networking, DOM / filesystem
|
+-- Scheduling
    +-- Tasks: eligible timer callbacks, dispatched UI events
    +-- Microtasks: promise reactions, queueMicrotask callbacks
    +-- Event loop: coordinates execution opportunities
```

These are cooperating parts, not a pipeline through which every operation travels. A normal function call runs on the stack immediately.

JavaScript execution on one thread runs to completion without another queued callback interrupting it. Workers provide additional execution threads. See [MDN's execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model).

### Browser Scheduling Model

1. Run a task, including its synchronous function calls.
2. At the following microtask checkpoint, drain pending microtasks, including newly queued ones.
3. The browser may update rendering when there is a rendering opportunity.
4. Select another runnable task and repeat.

This is a simplified model for the examples below. An empty stack alone is not permission to interrupt an ongoing synchronous operation. Browsers have multiple task queues; "macrotask" is common interview terminology for a task. See [MDN's runtime scheduling guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth).

## 6. Predict the Output

Run snippets independently. They use browser-compatible APIs; no Node-specific queue rules are needed.

### Exercise A: Timer vs Promise

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

<details>
<summary>Reveal output and explanation</summary>

**A, D, C, B.** The synchronous logs finish first. The promise reaction runs at the microtask checkpoint before the eligible timer task. The timer delay is not an exact execution appointment.

</details>

### Exercise B: Does a Promise Make Everything Asynchronous?

```javascript
console.log("start");
new Promise((resolve) => {
  console.log("executor");
  resolve();
}).then(() => console.log("reaction"));
console.log("end");
```

<details>
<summary>Reveal output and explanation</summary>

**start, executor, end, reaction.** The Promise constructor invokes its executor synchronously. The `.then()` reaction runs asynchronously. Expensive synchronous work inside the executor still blocks its thread.

</details>

### Exercise C: A Microtask Adds Another Microtask

```javascript
setTimeout(() => console.log("timer"), 0);
queueMicrotask(() => {
  console.log("microtask 1");
  queueMicrotask(() => console.log("microtask 2"));
});
console.log("sync");
```

<details>
<summary>Reveal output and explain a production risk</summary>

**sync, microtask 1, microtask 2, timer.** Newly queued microtasks are drained before moving to another task. An endlessly replenished microtask queue can delay timers and rendering. See [MDN's microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide).

</details>

### Exercise D: Single-Threaded Does Not Mean Immediate Timers

Suppose code schedules `setTimeout(callback, 0)` and then performs five seconds of synchronous computation on the same thread.

<details>
<summary>Can the callback run during that computation?</summary>

No. It must wait for the synchronous work to finish and for a scheduling opportunity. In a browser this can also delay user interaction and rendering. Zero delay does not bypass a busy stack.

</details>

## 7. Questions for a 4-Year Developer

<details>
<summary>1. How can JavaScript handle multiple requests if it is single-threaded?</summary>

The environment can keep I/O operations in progress while JavaScript executes other code. Completion handlers are scheduled to run later. This is concurrency; it does not require those JavaScript handlers to execute in parallel on one thread.

</details>

<details>
<summary>2. Will wrapping a large loop in an async function stop UI freezing?</summary>

No. `async` does not move computation to another thread. CPU-heavy work still occupies the current thread. Consider a worker or splitting work into tasks that allow the browser to handle other work. Repeatedly awaiting already-resolved promises can keep execution in microtasks and still delay rendering.

</details>

<details>
<summary>3. Can you use the browser queue diagram to explain every Node.js ordering question?</summary>

No. Node.js has event-loop phases and additional scheduling mechanisms such as `process.nextTick()` and `setImmediate()`. Timer ordering depends on context. Do not assert a universal order between a top-level timeout and immediate. Study those separately using the [Node.js event-loop guide](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) and [timer documentation](https://nodejs.org/api/timers.html).

</details>

<details>
<summary>4. A request finishes quickly, but its handler runs late. What might cause that?</summary>

The JavaScript thread might be occupied by a long synchronous task, or microtasks might be delaying subsequent work. Distinguish operation completion from handler execution. In practice, inspect a performance trace for long tasks and measure event-loop delay where appropriate.

</details>

## 8. Common Interview Mistakes

| Avoid saying                             | Say instead                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| "V8 provides the DOM."                   | "The browser provides the DOM."                                                     |
| "All callbacks are asynchronous."        | "The API determines when a callback runs; array callbacks often run synchronously." |
| "A promise runs code on another thread." | "Promise reactions are scheduled; promises do not create threads."                  |
| "Microtasks interrupt synchronous code." | "They run at microtask checkpoints."                                                |
| "setTimeout guarantees exact timing."    | "Its callback runs after the delay and an available scheduling opportunity."        |
| "The entire runtime has one thread."     | "One JavaScript execution thread runs one piece of JS at a time."                   |

## 9. Revision Checklist

- [ ] Explain runtime vs engine without reading.
- [ ] Name three language features and three host APIs.
- [ ] Describe browser and Node.js differences.
- [ ] Draw the stack, heap, host APIs, queues, and event loop.
- [ ] Predict exercises A-C and explain every step.
- [ ] Explain why a zero-delay timer can run late.
- [ ] Distinguish asynchronous I/O from parallel JavaScript execution.
- [ ] Explain why `async` does not fix CPU-heavy work.

**Self-assessment:** Give yourself one point per item you can explain with an example. Revisit unchecked items before moving on to execution contexts and the call stack.
