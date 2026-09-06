# Microtask Queue: Interview Notes

**Topic 6 | Prerequisite:** [Macrotask Queue / Task Queue](macrotask-queue.md). **Study time:** 40 minutes.

Predict every output before expanding the answer. Run snippets independently. Expandable answers work in Markdown viewers that support HTML details, including GitHub. These examples use browser-compatible APIs and exclude Node-specific scheduling such as `process.nextTick`.

## 1. Your 30-Second Interview Answer

> The microtask queue holds work such as promise reactions and queueMicrotask callbacks. At a microtask checkpoint, queued microtasks execute in enqueue order until the queue is empty, including work added while draining. In ordinary task execution, this happens before the next task can run. This priority does not interrupt synchronous code. Repeatedly creating microtasks can prevent the browser from progressing to other work.

## 2. What Creates Microtasks?

| Mechanism                  | When work is queued                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `promise.then(handler)`    | When a fulfillment reaction is ready; rejection handlers can also be supplied to then |
| `promise.catch(handler)`   | When its rejection reaction is ready                                                  |
| `promise.finally(handler)` | When the upstream promise settles, whether fulfilled or rejected                      |
| `queueMicrotask(handler)`  | The call explicitly enqueues the callback                                             |
| `await`                    | Resumption after the awaited result uses promise scheduling                           |
| `MutationObserver`         | Browser mutation notifications are delivered through microtasks                       |

Promise handlers are not all queued at registration time. A handler attached to a pending promise waits for settlement. The Promise constructor's executor runs synchronously. See [MDN: then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).

## 3. Priority and Draining

For ordinary examples: finish current synchronous work, drain microtasks at the checkpoint, then allow another task. New microtasks join the end, behind already queued microtasks. "Higher priority" does not mean preemption or faster computation. See [MDN's microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide).

```text
Current synchronous work finishes
               |
               v
       Microtask checkpoint
               |
       Take oldest microtask <------+
               |                   |
               v                   |
       Execute its callback        |
               |                   |
       More microtasks? -- yes -----+
               |
               no
               |
               v
       Continue browser scheduling
```

There are checkpoints beyond the simplified "after each task" description. Do not generalize this into "every function return drains the queue" or "one checkpoint per browser iteration."

## 4. Output-Prediction Method

1. Record synchronous logs first, following function calls.
2. Keep separate lists for pending microtasks and timer work.
3. Track promise state; enqueue only reactions whose prerequisites are satisfied.
4. Run the oldest microtask and append any new microtasks to the end.
5. Continue until the microtask queue is empty, then consider the next runnable task.

For promise chains, each link uses the promise returned by the preceding link. Do not put every written `.then()` into the queue at once. Returned promises, thenables, and `finally` can introduce additional internal jobs; not every microtask prints a log.

## 5. Practice: Basics to Chains

### Exercise A: Promise vs Timer

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

<details>
<summary>Reveal output</summary>

**A, D, C, B.** C is a ready promise reaction. It runs after synchronous code but before the later timer task.

</details>

### Exercise B: The Executor Is Synchronous

```javascript
console.log("start");
new Promise((resolve) => {
  console.log("executor");
  resolve(7);
  console.log("after resolve");
}).then((value) => console.log(value));
console.log("end");
```

<details>
<summary>Reveal output and the resolve trap</summary>

**start, executor, after resolve, end, 7.** Calling `resolve` neither returns from the executor nor invokes the handler inline. The executor keeps running synchronously.

</details>

### Exercise C: queueMicrotask vs Promise.then

```javascript
queueMicrotask(() => console.log("Q1"));
Promise.resolve().then(() => console.log("P"));
queueMicrotask(() => console.log("Q2"));
console.log("sync");
```

<details>
<summary>Reveal output</summary>

**sync, Q1, P, Q2.** In these browser examples, both mechanisms enqueue into the microtask queue. There is no rule that promises beat explicitly queued microtasks; enqueue order matters.

</details>

### Exercise D: A Microtask Schedules Another

```javascript
queueMicrotask(() => {
  console.log("M1");
  queueMicrotask(() => console.log("M3"));
  console.log("M1 ends");
});
queueMicrotask(() => console.log("M2"));
setTimeout(() => console.log("T"), 0);
console.log("S");
```

<details>
<summary>Reveal output and queue trace</summary>

**S, M1, M1 ends, M2, M3, T.** M3 does not interrupt M1, and it does not jump ahead of M2.

| Moment                | Waiting microtasks, front to back |
| --------------------- | --------------------------------- |
| Synchronous code ends | M1, M2                            |
| M1 starts             | M2                                |
| M1 queues M3          | M2, M3                            |
| M1 finishes           | M2, M3                            |
| M2 finishes           | M3                                |
| M3 finishes           | Empty                             |

The checkpoint includes M3 even though it was not present when draining began.

</details>

### Exercise E: A Chain Is Not Queued All at Once

```javascript
Promise.resolve()
  .then(() => console.log("P1"))
  .then(() => console.log("P2"));
queueMicrotask(() => console.log("Q"));
console.log("S");
```

<details>
<summary>Reveal output and chain timing</summary>

**S, P1, Q, P2.** Initially, P1 and Q are queued. The promise returned by the first `.then` is still pending. P1 returns normally, settling that promise and queuing P2 behind Q.

</details>

## 6. Promise.catch: Failure and Recovery

`catch(handler)` is equivalent to `then(undefined, handler)`. Its handler processes rejection. Returning a normal value recovers the chain; throwing rejects the returned promise. See [MDN: catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch).

### Exercise F: Recover from Rejection

```javascript
Promise.reject(new Error("failed"))
  .catch((error) => {
    console.log(error.message);
    return "recovered";
  })
  .then((value) => console.log(value));
queueMicrotask(() => console.log("Q"));
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, failed, Q, recovered.** The rejection handler is ready initially. It returns a value, which fulfills the next promise and schedules its handler behind the already queued Q.

</details>

## 7. Promise.finally: Cleanup, Not Value Transformation

`finally` runs after fulfillment or rejection and receives no result argument. Normally it preserves the preceding outcome; returning an ordinary value does not replace it. Throwing or returning a rejected promise changes the resulting chain to rejection. If cleanup returns a pending promise, the chain waits for it. See [MDN: finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally).

### Exercise G: Does Finally Replace the Value?

```javascript
Promise.resolve("original")
  .finally(() => {
    console.log("cleanup");
    return "replacement";
  })
  .then((value) => console.log(value));
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, cleanup, original.** Cleanup completes normally, so the original fulfillment value passes through. Do not treat `finally` as `.then(onFinally, onFinally)` with identical value behavior or identical internal scheduling.

</details>

### Exercise H: Cleanup Throws

```javascript
Promise.resolve("success")
  .finally(() => {
    throw new Error("cleanup failed");
  })
  .catch((error) => console.log(error.message));
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, cleanup failed.** Throwing in cleanup causes the resulting promise to reject, replacing the earlier successful outcome.

</details>

## 8. Pending Promises and Task Boundaries

### Exercise I: A Pending Promise Has No Ready Reaction Yet

```javascript
let finish;
const pending = new Promise((resolve) => {
  finish = resolve;
});
pending.then(() => console.log("reaction"));
queueMicrotask(() => console.log("Q"));
setTimeout(() => {
  console.log("timer starts");
  finish();
  console.log("timer ends");
}, 0);
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, Q, timer starts, timer ends, reaction.** The promise is initially pending. Its handler is registered but not ready. The timer settles it; the reaction waits until the timer's synchronous code finishes. Priority cannot make an unavailable result arrive sooner.

</details>

### Exercise J: Microtasks Between Timer Tasks

```javascript
setTimeout(() => {
  console.log("T1");
  queueMicrotask(() => console.log("M"));
  setTimeout(() => console.log("T2"), 0);
  console.log("T1 ends");
}, 0);
```

<details>
<summary>Reveal output</summary>

**T1, T1 ends, M, T2.** Microtasks are not a one-time startup step. Work queued during a later task is drained at its subsequent checkpoint before another task executes.

</details>

## 9. Draining and Starvation

### Exercise K: Finite Self-Scheduling

```javascript
let count = 0;
function next() {
  count += 1;
  console.log("M", count);
  if (count < 3) queueMicrotask(next);
}
queueMicrotask(next);
setTimeout(() => console.log("T"), 0);
```

<details>
<summary>Reveal output; what if the stop condition is removed?</summary>

**M 1, M 2, M 3, T.** Every newly queued call runs during the same draining process. Without the stop condition, the queue continually refills, delaying tasks and rendering. This is microtask starvation, not ordinary synchronous recursive stack growth: each invocation returns before the next begins.

</details>

## 10. Interview Follow-Ups

<details>
<summary>Is queueMicrotask(fn) identical to Promise.resolve().then(fn)?</summary>

Both defer the callback through microtask scheduling, but their contracts differ. `queueMicrotask` returns `undefined` and ignores callback results. An uncaught exception in it is reported as an ordinary exception. `.then` returns a promise; a thrown error rejects that promise. See [MDN: Enqueueing microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#enqueueing_microtasks).

</details>

<details>
<summary>Does a microtask have to be short, or run on another thread?</summary>

No. The name does not impose a runtime duration limit. Its JavaScript executes on its execution thread and can block if expensive. Keep these callbacks short because the queue must drain before scheduling can progress.

</details>

<details>
<summary>Does registering catch or finally make them execute immediately?</summary>

No. Registration is synchronous; handler execution is deferred until the corresponding promise reaction can run. Even an already settled promise does not call its attached handler inline.

</details>

## 11. Revision Checklist

- [ ] Explain microtask checkpoints and queue draining.
- [ ] Identify promise reactions, queueMicrotask, and mutation notifications.
- [ ] Separate synchronous executors from asynchronous handlers.
- [ ] Track registration versus readiness of promise reactions.
- [ ] Predict how chained then calls interleave with queueMicrotask.
- [ ] Explain catch recovery and finally outcome preservation.
- [ ] Append nested microtasks behind existing work.
- [ ] Explain why priority does not interrupt synchronous code.
- [ ] Distinguish starvation from stack overflow.
- [ ] Predict all eleven exercises and explain each ordering step.

**Next:** Combine the call stack, browser APIs, tasks, and microtasks into a complete event-loop walkthrough.
