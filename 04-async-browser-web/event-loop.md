# Event Loop: Interview Notes

**Topic 7 | Prerequisites:** Complete Topics 1-6, ending with [Microtask Queue](microtask-queue.md). **Study time:** 35 minutes.

Predict outputs before expanding answers. Run snippets independently. Expandable sections work in Markdown viewers that support HTML details, including GitHub. These notes focus on the browser event loop, not Node.js phases.

## 1. Your 30-Second Interview Answer

> The event loop is the host's scheduling mechanism that coordinates tasks, microtasks, and, in a browser window, rendering opportunities. Current synchronous JavaScript finishes before another queued task runs. At a microtask checkpoint, pending microtasks drain, including newly added ones. The browser can then progress to other work. When scheduled work invokes a JavaScript callback, the engine executes it on the call stack like any other function.

## 2. What Does It Monitor?

Interviewers often say it "monitors the stack and queues." Treat that as shorthand for coordinating execution boundaries and available work, not a second JavaScript function constantly polling your stack.

| Component       | Role                                                           |
| --------------- | -------------------------------------------------------------- |
| Call stack      | Tracks currently active JavaScript calls                       |
| Host APIs       | Manage timers, I/O, event delivery, and other facilities       |
| Task queues     | Hold work from task sources such as timers and user input      |
| Microtask queue | Holds promise reactions and explicit microtasks                |
| Event loop      | Selects runnable work and performs prescribed scheduling steps |

The host manages timer waiting; the engine executes callback code. The event loop does not make a timer callback interrupt ordinary synchronous code or make two callbacks execute simultaneously on one thread.

## 3. How the Parts Fit Together

```text
Host facilities: timers / input / networking
                       |
                       v
                 Runnable tasks
                       |
                Event loop selects
                       |
                       v
            Run task and its JS calls
                 [CALL STACK]
                       |
              At a checkpoint
                       |
                       v
              Drain microtasks <-------+
                       |              |
                       +-- new work --+
                       |
                 Queue empty
                       |
                       v
          Continue host scheduling;
          rendering when appropriate
```

There are multiple task sources and potentially multiple task queues. There is not one universal FIFO ordering across all browser work. This diagram omits many host details and does not imply that all asynchronous activity must pass through a task before it can create a microtask. See the [HTML Standard's event-loop model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model).

## 4. One Conceptual Iteration

For ordinary output questions, use this simplified cycle:

1. Select a runnable task, if one is available.
2. Run it, including its synchronous JavaScript calls.
3. Perform a microtask checkpoint and drain pending microtasks.
4. Allow applicable browser work, including rendering at an appropriate opportunity.
5. Repeat when there is work to process.

An iteration is not a fixed amount of time or one screen frame. Real browsers have more scheduling steps and checkpoints; rendering is not guaranteed after every task. See [MDN's runtime walkthrough](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth).

<details>
<summary>Why do microtasks run before the next macrotask?</summary>

The browser scheduling model requires a microtask checkpoint before selecting another task in this ordinary flow. It drains the queue, rather than taking only one microtask. This supports completion work before unrelated task processing continues. It is a scheduling rule, not a property of promise callbacks being faster.

</details>

<details>
<summary>Does an empty stack guarantee that my timer runs next?</summary>

No. The timer must be eligible, pending microtasks may need to run, and the browser must select its task. An empty stack is not a priority guarantee for a particular callback.

</details>

## 5. When Does a Callback Enter the Stack?

Registering a callback does not execute its body. Once its task or microtask invokes it, the engine creates the function's execution context. Synchronous functions called inside that callback are pushed and popped normally. Returning removes the active call; retained closure state can remain alive.

Explicit direct calls are different: calling a function yourself, or using synchronous `dispatchEvent`, can execute a callback now without waiting for a new task.

## 6. Guided Output Exercises

### Exercise A: Complete Lifecycle

```javascript
function report() {
  console.log("function");
}

console.log("start");
setTimeout(() => {
  console.log("timer");
  report();
  queueMicrotask(() => console.log("timer microtask"));
  console.log("timer ends");
}, 0);
Promise.resolve().then(() => console.log("promise"));
queueMicrotask(() => console.log("explicit microtask"));
console.log("end");
```

<details>
<summary>Reveal output and scheduling trace</summary>

```text
start
end
promise
explicit microtask
timer
function
timer ends
timer microtask
```

| Stage                    | What executes                                        | Waiting microtasks after the stage |
| ------------------------ | ---------------------------------------------------- | ---------------------------------- |
| Initial synchronous work | start, register timer and microtasks, end            | promise, explicit microtask        |
| First checkpoint         | promise, explicit microtask                          | Empty                              |
| Later timer task         | timer, report(), queue another microtask, timer ends | timer microtask                    |
| Following checkpoint     | timer microtask                                      | Empty                              |

During `report`, the user-function stack is **timer callback -> report**. The initial script is no longer an active frame. During the last microtask, the timer callback has already returned. Browser/debugger host frames are omitted from this drawing.

</details>

### Exercise B: Nested Microtasks Before Later Work

```javascript
setTimeout(() => console.log("T"), 0);
queueMicrotask(() => {
  console.log("M1");
  queueMicrotask(() => console.log("M3"));
});
queueMicrotask(() => console.log("M2"));
console.log("S");
```

<details>
<summary>Reveal output and queue changes</summary>

**S, M1, M2, M3, T.** Start with microtasks `[M1, M2]`. Running M1 appends M3, leaving `[M2, M3]`. Both drain before T gets its task execution opportunity.

</details>

### Exercise C: Checkpoints Happen Again After Later Tasks

```javascript
setTimeout(() => {
  console.log("T1 starts");
  Promise.resolve().then(() => console.log("P"));
  setTimeout(() => console.log("T2"), 0);
  console.log("T1 ends");
}, 0);
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, T1 starts, T1 ends, P, T2.** P does not interrupt T1. It executes at the following checkpoint before the later T2 task. Do not process all timers first and promises only once at the end.

</details>

### Exercise D: Promise Readiness Still Matters

```javascript
let resolveResult;
const result = new Promise((resolve) => {
  resolveResult = resolve;
});
result.then(() => console.log("result"));
queueMicrotask(() => console.log("ready microtask"));
setTimeout(() => {
  console.log("settle");
  resolveResult();
  console.log("after settle");
}, 0);
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, ready microtask, settle, after settle, result.** Registering a handler on a pending promise does not make its reaction ready. The timer settles the promise; its remaining synchronous code completes before that reaction executes.

</details>

### Exercise E: async/await in the Combined Model

```javascript
async function work() {
  console.log("work starts");
  await Promise.resolve();
  console.log("work resumes");
}

console.log("S");
work();
queueMicrotask(() => console.log("Q"));
setTimeout(() => console.log("T"), 0);
console.log("E");
```

<details>
<summary>Reveal output and the suspended function</summary>

**S, work starts, E, work resumes, Q, T.** `work` starts synchronously. Awaiting the already fulfilled native promise schedules its continuation before Q is enqueued. It suspends that function, not the whole thread. Its resumed execution finishes during microtask processing before T.

</details>

## 7. Common Interview Traps

| Claim                                              | Correction                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| "The event loop runs callbacks in parallel."       | Callbacks execute one at a time on their JS execution thread.       |
| "Microtasks interrupt current JavaScript."         | They execute at checkpoints.                                        |
| "Every function return triggers a checkpoint."     | A return to a synchronous caller does not automatically yield.      |
| "One loop iteration means one frame."              | Scheduling iterations and rendering frames are not equivalent.      |
| "A zero-delay timer goes straight onto the stack." | It schedules later host-managed work.                               |
| "All promise handlers run before all timers."      | Only ready reactions participate; later timers may settle promises. |
| "Every asynchronous callback is a task."           | Promise reactions are microtasks; other APIs have their own rules.  |

## 8. Questions for a 4-Year Developer

<details>
<summary>A loading message was set before a long calculation. Why might it not appear until afterward?</summary>

Updating the DOM is not the same as painting the result. Long synchronous work can prevent the browser from reaching a rendering opportunity. Keep main-thread work bounded, or move suitable computation to a worker. One deferred callback alone does not guarantee a paint before heavy work begins.

</details>

<details>
<summary>Can the call stack repeatedly become empty while the page still feels frozen?</summary>

Yes. An endlessly replenished microtask queue can keep the browser draining microtasks instead of progressing to tasks and rendering. Short individual callbacks do not help if together they never let the checkpoint finish.

</details>

<details>
<summary>Does a completed network request mean its JavaScript handler has already executed?</summary>

No. Network completion, promise settlement, and handler execution are different stages. A busy thread or other pending work can delay the handler. Queue priority cannot make a still-pending response arrive sooner.

</details>

<details>
<summary>Is the event loop part of V8? Does Node.js follow this exact browser model?</summary>

The surrounding host integrates scheduling with the engine. V8 executes JavaScript and supports promise jobs, but the complete browser event loop also coordinates host facilities and rendering. Node.js integrates V8 with its own event-loop phases and I/O facilities; browser rendering rules do not transfer to Node.js.

</details>

## 9. Your Output-Prediction Worksheet

Use four columns: **executing code**, **microtasks**, **registered/runnable task work**, **output**. Update them after each scheduling operation. Distinguish timer registration from eligibility, and promise-handler registration from readiness. Do not invent exact elapsed times.

After each task, drain ready microtasks in enqueue order, adding new ones to the end. Only then consider another task. For unrelated task sources, state when ordering is not guaranteed.

## 10. Revision Checklist

- [ ] Define the event loop without calling it a parallel JS executor.
- [ ] Explain what "monitoring the stack and queues" means conceptually.
- [ ] Connect host APIs, tasks, microtasks, and active function calls.
- [ ] Describe one conceptual iteration and its limitations.
- [ ] Explain why microtasks drain before the next ordinary task.
- [ ] Trace callback entry and return on the stack.
- [ ] Predict all five exercises with a worksheet.
- [ ] Explain blocking, starvation, and rendering opportunities.
- [ ] Distinguish browser scheduling from Node.js phases.

**Readiness check:** Explain Exercise A aloud in under two minutes, including both checkpoints and the nested synchronous call. Then solve Exercises B-E without looking at the answers.
