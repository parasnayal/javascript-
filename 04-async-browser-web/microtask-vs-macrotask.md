# Microtask vs Macrotask: Interview Notes

**Topic 11 | Prerequisites:** Topics 1-10, ending with [setTimeout](set-timeout.md). **Study time:** 30 minutes.

Cover the answers, classify each callback, and predict its output before expanding. Run snippets independently. Expandable answers work in Markdown viewers that support HTML details, including GitHub. Browser scheduling is the default; these notes do not cover Node-specific phases or nextTick.

## 1. The Table to Know

**Queues describe scheduling. Every JavaScript callback executes on its execution thread's call stack when invoked.** A queued callback does not execute inside a queue.

| Operation                            | Scheduling / execution category                               |
| ------------------------------------ | ------------------------------------------------------------- |
| Normal synchronous JavaScript        | Runs now on the call stack, within current execution          |
| Promise.then handler                 | Microtask reaction when the matching outcome is ready         |
| Promise.catch handler                | Microtask reaction when rejection is ready                    |
| Promise.finally handler              | Microtask reaction after the upstream promise settles         |
| queueMicrotask callback              | Explicitly queued microtask                                   |
| setTimeout callback                  | Timer task after host waiting and scheduling                  |
| setInterval callback                 | Repeated timer task invocations                               |
| Browser-delivered DOM input callback | Invoked during event dispatch associated with task processing |
| Explicit dispatchEvent listener      | Invoked synchronously during that dispatch call               |

Timer and promise registration calls themselves are synchronous. Calling then on a pending promise registers a reaction without making it ready immediately. See [MDN: Tasks and microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide).

The DOM-event qualification matters: `dispatchEvent()` invokes listeners before returning. Also, event dispatch can invoke multiple listeners; one listener does not automatically equal one task. See [MDN: dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).

## 2. The Comparison

| Question                           | Microtasks                                          | Tasks / macrotasks                                                      |
| ---------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| When processed?                    | At a microtask checkpoint                           | When selected by the event loop                                         |
| How much work?                     | Drain until empty, including newly appended work    | Select and execute a runnable task, then perform applicable checkpoints |
| Can it interrupt synchronous code? | No                                                  | No, in these ordinary examples                                          |
| Ordering model                     | Enqueue order among ready microtasks                | Multiple task sources; no universal FIFO across all sources             |
| Can it block?                      | Yes, through long work or continual queue refilling | Yes, through a long-running task                                        |

For these examples: finish synchronous work, drain microtasks, then consider another task. Repeat the checkpoint after later task execution. This is a simplified model, not "all promises first, then all timers forever." Rendering is not guaranteed after each task.

## 3. Your 30-Second Interview Answer

> Microtasks and tasks are scheduling categories, and their JavaScript callbacks execute on the call stack. Promise reactions and queueMicrotask use microtasks; timers use tasks. At checkpoints, microtasks drain before the next ordinary task, including work added while draining. Ordering depends on readiness and enqueue order, so a pending promise cannot outrun a timer merely because it is a promise. Explicit event dispatch is a synchronous exception to the usual DOM-event shorthand.

## 4. Classification Warm-Up

Classify each as **synchronous**, **microtask**, or **task**. Then explain when it becomes ready.

| Item                                                  | Your answer |
| ----------------------------------------------------- | ----------- |
| Promise constructor executor                          | ...         |
| forEach callback                                      | ...         |
| Handler passed to an already fulfilled promise's then | ...         |
| Timer callback that resolves a promise                | ...         |
| Reaction to that newly fulfilled promise              | ...         |
| Listener invoked by explicit dispatchEvent            | ...         |

<details>
<summary>Reveal classifications</summary>

In order: **synchronous, synchronous, microtask, task, microtask, synchronous**. The timer remains task work even though it creates ready promise reactions. The constructor executor does not become asynchronous just because it belongs to a promise.

</details>

## 5. Mixed Output Exercises

### Exercise A: Ready Reactions and a Timer

```javascript
console.log("S");
setTimeout(() => console.log("T"), 0);
Promise.resolve().then(() => console.log("then"));
Promise.reject("failure").catch(() => console.log("catch"));
Promise.resolve().finally(() => console.log("finally"));
queueMicrotask(() => console.log("Q"));
console.log("E");
```

<details>
<summary>Reveal output</summary>

**S, E, then, catch, finally, Q, T.** The four visible microtask callbacks are ready in registration order. Finally can introduce additional internal promise work, but no other log in this example changes position because of it.

</details>

### Exercise B: Chains and Nested Microtasks

```javascript
Promise.resolve()
  .then(() => {
    console.log("P1");
    queueMicrotask(() => console.log("inner Q"));
  })
  .then(() => console.log("P2"));
queueMicrotask(() => console.log("outer Q"));
setTimeout(() => console.log("T"), 0);
console.log("S");
```

<details>
<summary>Reveal output and trace</summary>

**S, P1, outer Q, inner Q, P2, T.** P1 queues inner Q while it runs. P2 becomes ready only after P1 returns and fulfills the intermediate promise.

| Moment            | Ready microtasks, front to back |
| ----------------- | ------------------------------- |
| Script finishes   | P1, outer Q                     |
| P1 queues inner Q | outer Q, inner Q                |
| P1 returns        | outer Q, inner Q, P2            |
| outer Q finishes  | inner Q, P2                     |
| inner Q finishes  | P2                              |
| P2 finishes       | Empty                           |

The timer can execute later; it never jumps into this drain because its delay is zero.

</details>

### Exercise C: Each Interval Tick Gets a Checkpoint

```javascript
let count = 0;
const id = setInterval(() => {
  count += 1;
  const current = count;
  console.log("tick", current);
  queueMicrotask(() => console.log("microtask", current));
  if (current === 2) clearInterval(id);
}, 20);
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, tick 1, microtask 1, tick 2, microtask 2.** Each callback's synchronous work finishes before its microtask. Clearing the interval prevents future ticks, not the microtask already queued by the last tick. No exact timestamp is guaranteed.

</details>

### Exercise D: DOM Dispatch Does Not Always Wait

```javascript
const target = new EventTarget();
target.addEventListener("practice", () => {
  console.log("event");
  queueMicrotask(() => console.log("event microtask"));
});

queueMicrotask(() => console.log("earlier microtask"));
setTimeout(() => console.log("T"), 0);
target.dispatchEvent(new Event("practice"));
console.log("S ends");
```

<details>
<summary>Reveal output and explain the exception</summary>

**event, S ends, earlier microtask, event microtask, T.** Explicit dispatch runs the listener within the ongoing synchronous call. It queues a microtask behind the earlier one. Returning from the listener does not interrupt the surrounding script with a checkpoint.

</details>

### Exercise E: A Timer Produces Microtask Work

```javascript
let finish;
const pending = new Promise((resolve) => {
  finish = resolve;
});
pending.then(() => console.log("P"));
setTimeout(() => {
  console.log("T1");
  finish();
  queueMicrotask(() => console.log("Q"));
  setTimeout(() => console.log("T2"), 0);
  console.log("T1 ends");
}, 0);
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, T1, T1 ends, P, Q, T2.** P is not ready at registration. Resolving the pending promise in T1 queues P before Q. Both wait for T1 to finish, then drain before the later T2 task.

</details>

### Exercise F: Catch, Cleanup, and a Timer

```javascript
Promise.resolve()
  .then(() => {
    console.log("P");
    throw new Error("failed");
  })
  .catch((error) => {
    console.log(error.message);
    return "recovered";
  })
  .finally(() => console.log("cleanup"))
  .then((value) => console.log(value));
queueMicrotask(() => console.log("Q"));
setTimeout(() => console.log("T"), 0);
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, P, Q, failed, cleanup, recovered, T.** P's failure queues catch behind Q. Catch recovers, finally preserves the recovered value, and the last reaction prints it. Internal jobs and newly ready handlers continue draining before the timer task.

</details>

## 6. Interview Traps

<details>
<summary>Do microtasks have a separate call stack?</summary>

Not on the same JavaScript execution thread. Their callbacks execute on its call stack when invoked, just like timer callbacks. Queue classification describes when execution is scheduled, not a separate place where JavaScript runs.

</details>

<details>
<summary>Does a promise waiting for fetch always beat an already eligible timer?</summary>

No. Pending operations do not supply ready fulfillment handlers. Their completion time and the resulting enqueue order matter. Priority applies to ready scheduled work, not to an unavailable network result.

</details>

<details>
<summary>Does microtask mean fast, and macrotask mean slow?</summary>

No. Both can contain expensive synchronous work. A microtask can also enqueue more microtasks indefinitely, preventing scheduling from progressing to timers and rendering.

</details>

<details>
<summary>Can I use this table to rank every browser callback?</summary>

No. Rendering callbacks such as requestAnimationFrame have their own place in browser processing. Task sources can have different scheduling priorities. Use this table for the listed mechanisms, and check the relevant API before making broader claims.

</details>

## 7. Revision Checklist

- [ ] Reproduce the classification table, including the DOM exception.
- [ ] Explain why queues schedule callbacks but the stack executes them.
- [ ] Separate synchronous registration from callback readiness.
- [ ] Drain newly added microtasks before considering another ordinary task.
- [ ] Revisit checkpoints after timers and interval ticks.
- [ ] Trace chain recovery and cleanup without inventing global priority rules.
- [ ] Predict all six exercises and explain every transition.

**Mock interview:** Spend one minute on the comparison table, three minutes tracing Exercise B, then three minutes tracing Exercise F. Score one point for each correct output and one for its explanation: 12 points across the six exercises.
