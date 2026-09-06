# Macrotask Queue / Task Queue: Interview Notes

**Topic 5 | Prerequisite:** [Synchronous vs Asynchronous JavaScript](synchronous-vs-asynchronous.md). **Study time:** 30 minutes.

Predict each answer before expanding it. Run snippets independently. Expandable sections work in Markdown viewers that support HTML details, including GitHub. These notes describe browser scheduling; Node.js has a different event-loop structure.

## 1. Your 30-Second Interview Answer

> A task queue holds scheduled work that the browser's event loop can select and execute. Timer callbacks and browser-delivered user input are common examples. A task does not interrupt ordinary synchronous JavaScript. After a task finishes, pending microtasks run at a checkpoint before another task is selected. A zero-delay timeout schedules later work; it does not call the function immediately. "Macrotask" is common tutorial terminology; the HTML standard calls it a task.

## 2. What Is a Task Queue?

Distinguish three stages: an operation is registered, work becomes runnable, and the browser selects it for execution. A task is a unit of scheduled work, not necessarily just one function call.

The familiar single FIFO queue is a teaching model. Browsers have one or more task queues and task sources; there is no universal FIFO ordering across all sources. The event loop chooses a queue and its oldest runnable task. See the [HTML Standard's event-loop definitions](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops).

```text
Browser facilities                    Scheduling

Eligible timers --------------------> Timer tasks
Browser-delivered input ------------> User-interaction tasks
Message delivery -------------------> Message tasks
                                           |
                                  Event loop selects work
                                           |
                                           v
                                 Task executes JavaScript
                                 and synchronous calls
```

A task queue is not the call stack. Queued work has not started; the stack tracks active calls. A timer still waiting for its delay is not an executing call frame.

<details>
<summary>Interview question: Is everything in one FIFO callback queue?</summary>

No. Different task sources can use different queues, and scheduling across sources is not one global first-come-first-served list. Do not infer a guaranteed timer-versus-click order merely from a drawing containing one queue.

</details>

## 3. Common Task Sources

| Operation     | Work associated with tasks                        |
| ------------- | ------------------------------------------------- |
| `setTimeout`  | Invocation of an eligible one-shot timer callback |
| `setInterval` | Repeated timer callback invocations               |
| User input    | Browser dispatch of input events such as clicks   |
| Messaging     | Delivery through `postMessage` or a message port  |
| Networking    | Host processing associated with network activity  |

Do not classify `fetch(...).then(handler)` as a task callback: the promise reaction is a microtask. Networking involves host work, but the JavaScript continuation's API determines its scheduling. See [MDN's runtime scheduling guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth).

<details>
<summary>Are requestAnimationFrame callbacks ordinary timer tasks?</summary>

No. They participate in rendering updates. Avoid treating every delayed browser callback as an item in one timer queue. Rendering is also not guaranteed after every task.

</details>

## 4. When Does a Task Execute?

For these ordinary browser examples, use this simplified cycle:

1. The current task runs its synchronous JavaScript to completion.
2. The browser performs a microtask checkpoint, draining pending microtasks.
3. Rendering work may occur at an appropriate rendering opportunity.
4. The event loop selects another runnable task.

The browser processes tasks individually; it does not drain every task before considering microtasks. We will study microtasks in the next topic. This outline is not the complete browser processing algorithm. See [MDN: Tasks vs microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth#tasks_vs_microtasks).

<details>
<summary>Is "the stack is empty" the complete condition for running a timer?</summary>

No. The timer must be eligible, the current execution must yield at the appropriate boundary, and scheduling must select its task. An empty stack is not a guarantee that a particular timer runs next.

</details>

## 5. setTimeout(fn, 0) Is Not Immediate

### Exercise A: Direct Call vs Scheduled Call

```javascript
function report() {
  console.log("report");
}

console.log("start");
setTimeout(report, 0);
report();
console.log("end");
```

<details>
<summary>Reveal output and explanation</summary>

**start, report, end, report.** The direct call runs now. The timeout registers later work and returns. Its callback cannot interrupt the current synchronous code.

</details>

The delay is a scheduling threshold, not an exact appointment. Busy JavaScript, other work, and browser throttling can make execution later. Sufficiently nested short timers are clamped to a minimum delay, and inactive-tab policies vary. See [MDN: Reasons for timer delays](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#reasons_for_delays_longer_than_specified).

### Exercise B: A Busy Stack

```javascript
setTimeout(() => console.log("timer"), 0);

let sum = 0;
for (let number = 1; number <= 1000; number += 1) {
  sum += number;
}
console.log(sum);
console.log("finished");
```

<details>
<summary>Reveal output; what if the loop takes five seconds?</summary>

**500500, finished, timer.** The small loop makes this example quick to run. A longer calculation would delay the timer, not allow it to interrupt the loop. Timer eligibility and callback execution are different stages.

</details>

## 6. Tasks Run Separately

### Exercise C: Schedule from Inside a Task

```javascript
setTimeout(() => {
  console.log("outer starts");
  setTimeout(() => console.log("inner"), 0);
  console.log("outer ends");
}, 0);

console.log("script");
```

<details>
<summary>Reveal output and task boundaries</summary>

**script, outer starts, outer ends, inner.** The outer callback runs as later timer work. It registers another timer, then finishes its own synchronous code. The inner callback executes as separate later work, not as a nested synchronous call on the outer callback's stack.

| Stage                  | Currently executing                              | Other work                  |
| ---------------------- | ------------------------------------------------ | --------------------------- |
| Script                 | Log script                                       | Outer timer registered      |
| Outer timer task       | Log outer starts, register inner, log outer ends | Inner timer registered      |
| Later inner timer task | Log inner                                        | Outer callback has returned |

</details>

### Exercise D: Cancel Before Execution

```javascript
const id = setTimeout(() => console.log("timer"), 0);
clearTimeout(id);
console.log("canceled");
```

<details>
<summary>Reveal output</summary>

**canceled** only. Cancellation occurs synchronously before the timer callback can begin. Clearing a timer does not stop an already-running callback halfway through its body.

</details>

## 7. setInterval

### Exercise E: Two Separate Ticks

```javascript
let tick = 0;
const id = setInterval(() => {
  tick += 1;
  console.log("tick", tick);
  if (tick === 2) clearInterval(id);
}, 20);

console.log("registered");
```

<details>
<summary>Reveal output and interval caveat</summary>

**registered, tick 1, tick 2.** Repeated callbacks are separate executions, not a function that permanently remains on the stack. The interval is not an exact clock, and its synchronous callbacks cannot run simultaneously on this thread.

If a callback starts asynchronous work, a later tick may start more work before the previous operation finishes. The interval does not await promises returned by its callback.

</details>

## 8. DOM Events: Keep the Exception

Browser-delivered user input is commonly processed through tasks. Listener registration does not enqueue one callback per listener immediately. The event must occur and be dispatched; a single event dispatch can invoke multiple listeners.

Explicit `dispatchEvent()` invokes listeners synchronously, so not every DOM event handler represents a new task. This distinction was introduced in [Topic 3](browser-web-apis.md).

### Exercise F: Synchronous Dispatch vs Timer

```javascript
const target = new EventTarget();
target.addEventListener("practice", () => console.log("event"));

setTimeout(() => console.log("timer"), 0);
console.log("before dispatch");
target.dispatchEvent(new Event("practice"));
console.log("after dispatch");
```

<details>
<summary>Reveal output</summary>

**before dispatch, event, after dispatch, timer.** Explicit dispatch runs the listener before returning. It does not wait behind the timer.

</details>

## 9. Interview Follow-Ups

<details>
<summary>Does a timer delay start only after the call stack becomes empty?</summary>

No. Registering the timer starts host-managed waiting. The callback still needs a later execution opportunity. The browser does not first wait for the stack to empty and then begin the full requested delay.

</details>

<details>
<summary>If a click and a timer are ready, which runs first?</summary>

Do not claim a universal answer across task sources. Browser scheduling can prioritize different queues. Give ordering guarantees only when the relevant API and execution context justify them.

</details>

<details>
<summary>Can splitting a large calculation across timer callbacks improve responsiveness?</summary>

Yes, bounded chunks can give the browser opportunities to process other work between them. One enormous timer callback still blocks while it runs. Splitting creates opportunities, not a guarantee of a paint or input event between every two chunks.

</details>

<details>
<summary>Can I use this exact model for Node.js?</summary>

Use the general idea of scheduled work, but study Node.js event-loop phases separately. Browser-specific task-source and rendering rules do not describe the entire Node.js runtime.

</details>

## 10. Revision Checklist

- [ ] Define task and explain why "macrotask" is tutorial terminology.
- [ ] Distinguish registered timers, runnable tasks, and active stack frames.
- [ ] Name timer, user-interaction, and message-related task sources.
- [ ] Explain why there is no single universal FIFO queue across sources.
- [ ] Explain the execution boundary before another task can run.
- [ ] Predict all six examples without running them.
- [ ] Explain why zero-delay timers can run late.
- [ ] Distinguish explicit event dispatch from browser-delivered input.
- [ ] Explain why a long timer callback still blocks.

**Next:** Microtask queue. Learn what happens at the checkpoint between tasks, then combine both types of work in output questions.
