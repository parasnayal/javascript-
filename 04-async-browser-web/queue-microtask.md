# queueMicrotask(): Interview Notes

**Topic 9 | Prerequisite:** [Promises and the Event Loop](promises-and-event-loop.md). **Study time:** 25 minutes.

Predict outputs before expanding answers. Run snippets independently. Expandable answers work in Markdown viewers that support HTML details, including GitHub. The examples use browser-compatible APIs, without Node-specific queue rules.

## 1. Your 30-Second Interview Answer

> queueMicrotask is a host API that explicitly schedules a callback in the microtask queue. Registration happens immediately, but the callback executes later at a microtask checkpoint. It follows enqueue order alongside ready promise reactions. It returns undefined rather than a promise, ignores the callback's return value, and reports uncaught callback errors as ordinary exceptions rather than turning them into a rejected promise.

## 2. What Does It Schedule?

`queueMicrotask(callback)` schedules one callback invocation as a microtask. It accepts no delay and returns no cancellation handle. It is available in browser windows and workers, and also in Node.js as a host API. See [MDN: queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask).

The API call is synchronous; executing the supplied callback is deferred. Pass a function reference, such as `queueMicrotask(work)`, rather than calling it with `queueMicrotask(work())`.

<details>
<summary>Does the callback execute on a background thread?</summary>

No. It executes JavaScript on its execution thread. An expensive callback can still block. "Micro" describes its scheduling category, not a maximum execution duration.

</details>

## 3. When Does It Execute?

At a microtask checkpoint, pending microtasks drain in enqueue order. The callback does not interrupt the synchronous code that registered it. A microtask created during draining is appended and processed in that same draining process. In ordinary task examples, this finishes before another task runs. See [MDN: Microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks).

```text
Call queueMicrotask(fn) -> fn joins the microtask queue
          |
Continue synchronous code
          |
Reach microtask checkpoint
          |
Run earlier microtasks -> run fn -> drain remaining work
```

A nested synchronous function returning is not automatically a checkpoint. Nor does a microtask guarantee that a browser paint will happen immediately afterward.

## 4. Compare the APIs

| Property        | queueMicrotask(fn)          | Promise.resolve().then(fn)            |
| --------------- | --------------------------- | ------------------------------------- |
| Scheduling      | Explicitly enqueue callback | Enqueue reaction to fulfilled promise |
| Return from API | undefined                   | New promise                           |
| Callback result | Ignored                     | Determines returned promise's outcome |
| Callback throws | Ordinary reported exception | Rejects returned promise              |
| Chaining        | No promise chain provided   | then/catch/finally available          |

The general `pendingPromise.then(fn)` may not enqueue a fulfillment reaction yet. The table uses an already fulfilled promise. Neither mechanism has blanket priority over the other; readiness and enqueue order matter. See [MDN: Enqueueing microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#enqueueing_microtasks).

## 5. Output Exercises

### Exercise A: Deferred vs Direct Call

```javascript
function work() {
  console.log("work");
}
console.log("start");
queueMicrotask(work);
work();
console.log("end");
```

<details>
<summary>Reveal output</summary>

**start, work, end, work.** The direct call runs immediately; the queued invocation waits until synchronous execution finishes and microtasks can run.

</details>

### Exercise B: Return Values

```javascript
const result = queueMicrotask(() => {
  console.log("callback");
  return 42;
});
console.log(result);
```

<details>
<summary>Reveal output</summary>

**undefined, callback.** The API returns undefined immediately. Returning 42 from its callback does not change result or create a promise you can chain.

</details>

### Exercise C: Multiple Microtasks and a Promise

```javascript
queueMicrotask(() => console.log("Q1"));
Promise.resolve().then(() => console.log("P"));
queueMicrotask(() => console.log("Q2"));
setTimeout(() => console.log("T"), 0);
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, Q1, P, Q2, T.** The ready microtasks preserve their enqueue order. They drain before the later timer task.

</details>

### Exercise D: Nested Scheduling Does Not Jump the Queue

```javascript
queueMicrotask(() => {
  console.log("A");
  queueMicrotask(() => console.log("C"));
  console.log("A ends");
});
queueMicrotask(() => console.log("B"));
console.log("S");
```

<details>
<summary>Reveal output and queue changes</summary>

**S, A, A ends, B, C.** Initially `[A, B]` are waiting. A starts and appends C behind B. A finishes its own synchronous code before B or C can execute. Newly enqueued work does not require a new task.

</details>

### Exercise E: A Chain Becomes Ready in Stages

```javascript
Promise.resolve()
  .then(() => console.log("P1"))
  .then(() => console.log("P2"));
queueMicrotask(() => console.log("Q"));
```

<details>
<summary>Reveal output</summary>

**P1, Q, P2.** P2 depends on the promise returned by the first then. When P1 returns, P2 becomes ready and is queued behind Q. Written order alone is not sufficient to predict chained reactions.

</details>

### Exercise F: Read State When the Callback Runs

```javascript
let value = "before";
queueMicrotask(() => console.log(value));
value = "after";
console.log("sync");
```

<details>
<summary>Reveal output</summary>

**sync, after.** The closure reads the binding when the callback executes. Scheduling does not automatically snapshot a variable's current value. To retain a particular value, capture it in a separate binding before scheduling.

</details>

## 6. Practical Use: Batch Synchronous Changes

Use a microtask when several synchronous changes should trigger one small follow-up operation. This is batching until the scheduled flush runs, not a time-based debounce.

### Exercise G: One Flush for Three Changes

```javascript
const changes = [];
let scheduled = false;

function record(change) {
  changes.push(change);
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => {
    const batch = changes.splice(0);
    scheduled = false;
    console.log(batch.join(", "));
  });
}

record("name");
record("email");
record("role");
console.log("recorded");
```

<details>
<summary>Reveal output and batching boundary</summary>

**recorded**, then **name, email, role**. All three synchronous calls share one queued flush. A record call made after this flush, even from another microtask, can schedule a new flush. Do not claim this collects every change in an entire browser iteration.

</details>

## 7. Errors and Async Callbacks

<details>
<summary>Will try/catch around queueMicrotask catch an error thrown later by its callback?</summary>

No. That synchronous try block has already finished. Catch expected errors inside the callback, or choose a promise-based API when callers need to observe a result or rejection. The uncaught-error reporting behavior depends on the host.

</details>

### Exercise H: Handle Errors Where They Occur

```javascript
queueMicrotask(() => {
  try {
    throw new Error("microtask failure");
  } catch (error) {
    console.log(error.message);
  }
});
Promise.resolve()
  .then(() => {
    throw new Error("promise failure");
  })
  .catch((error) => console.log(error.message));
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, microtask failure, promise failure.** The microtask handles its exception locally. The promise handler rejects its returned promise, and the downstream catch runs as a later reaction. Without the local catch, the microtask exception would not become that promise chain's rejection.

</details>

<details>
<summary>What if I pass an async callback to queueMicrotask?</summary>

It invokes the function but does not await or consume its returned promise. Code after await follows promise scheduling independently. A failure in that async function rejects its ignored promise and can become an unhandled rejection. Use explicit error handling and a promise chain when completion matters.

</details>

## 8. Interview Traps

| Claim                                         | Correction                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| "It runs immediately."                        | Registration is immediate; invocation is deferred.                          |
| "It always beats promise callbacks."          | Ready microtasks follow enqueue order.                                      |
| "Nested microtasks run before existing ones." | They are appended behind existing work.                                     |
| "It has a then method."                       | The API returns undefined.                                                  |
| "It yields to browser rendering."             | Microtasks drain before scheduling progresses; it is not a paint guarantee. |
| "Repeated microtasks keep the UI responsive." | Continuous queue refilling can starve tasks and rendering.                  |

## 9. Revision Checklist

- [ ] Define the API and identify what it schedules.
- [ ] Distinguish synchronous registration from deferred invocation.
- [ ] Explain checkpoint timing without claiming every return yields.
- [ ] Compare return values and error handling with then.
- [ ] Trace mixed promise and explicit microtask ordering.
- [ ] Append nested microtasks in the correct position.
- [ ] Explain the batching example and its boundary.
- [ ] Explain starvation and ignored async callback promises.
- [ ] Predict all eight examples before expanding their answers.

**Interview practice:** Explain Exercises C-E using an enqueue-order table, then describe when you would choose a promise instead of queueMicrotask.
