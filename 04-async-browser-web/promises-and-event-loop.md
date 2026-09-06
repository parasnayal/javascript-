# Promises and the Event Loop: Interview Notes

**Topic 8 | Prerequisites:** [Microtask Queue](microtask-queue.md) and [Event Loop](event-loop.md). **Study time:** 45 minutes.

Predict each output and the promise states before expanding answers. Run snippets independently. Expandable answers work in Markdown viewers that support HTML details, including GitHub. Examples use standard promises and browser-compatible scheduling APIs.

## 1. Your 30-Second Interview Answer

> A promise represents an eventual value or failure. It can be pending, fulfilled, or rejected. Its executor runs synchronously, but its reaction handlers run asynchronously as microtasks in browsers. Every then call returns a new promise: a returned value fulfills it, a thrown error rejects it, and a returned promise makes it adopt that promise's eventual outcome. Chain ordering depends on when each promise settles and when its reactions are enqueued.

## 2. States and Resolution

| State     | Meaning                           |
| --------- | --------------------------------- |
| Pending   | Neither fulfilled nor rejected    |
| Fulfilled | Settled successfully with a value |
| Rejected  | Settled with a failure reason     |

```text
                     +--> fulfilled(value)
pending -------------|
                     +--> rejected(reason)
```

Fulfillment and rejection are final: a settled promise cannot switch state. **Resolved is not a fourth state, and does not always mean fulfilled.** A promise resolved with a pending promise is locked into following that promise while still pending. See [MDN: Promise states](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#description).

<details>
<summary>Interview question: Does a promise create a background thread?</summary>

No. It represents and coordinates an outcome. The operation may use host I/O facilities, but a long loop inside its executor or handler still occupies its JavaScript thread.

</details>

## 3. Promise.resolve()

| Input                                    | Result                                    |
| ---------------------------------------- | ----------------------------------------- |
| Ordinary non-thenable value              | A fulfilled promise containing that value |
| Native promise with matching constructor | The same promise is returned              |
| Thenable: object with callable then      | A promise that adopts its outcome         |

`Promise.resolve()` with no argument fulfills with `undefined`. It does not invoke an ordinary function passed as its value. Evaluating an argument such as `Promise.resolve(doWork())` calls `doWork` first; if that call throws, `Promise.resolve` never receives a value. See [MDN: Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).

### Exercise A: Immediate State, Deferred Handler

```javascript
const promise = Promise.resolve(10);
console.log(Promise.resolve(promise) === promise);
promise.then((value) => console.log(value));
console.log("sync");
```

<details>
<summary>Reveal output</summary>

**true, sync, 10.** The promise is already fulfilled, but its handler still waits for microtask processing. Settlement and handler execution are separate events.

</details>

## 4. Why Handlers Are Asynchronous

The promise contract schedules reactions instead of invoking them inline. This gives consistent callback timing whether a result is already available or arrives later. Registration happens now; the handler cannot interrupt the caller's current synchronous work. See [MDN: then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).

### Exercise B: Executor vs Reaction

```javascript
console.log("start");
new Promise((resolve, reject) => {
  console.log("executor");
  resolve("first");
  reject(new Error("ignored"));
  console.log("executor ends");
}).then((value) => console.log(value));
console.log("end");
```

<details>
<summary>Reveal output and settlement behavior</summary>

**start, executor, executor ends, end, first.** The first resolution locks in the result. The later rejection attempt has no effect. Calling resolve does not return from the executor, so its remaining synchronous code runs.

</details>

## 5. What then Returns

For `const next = current.then(handler)`, `next` is a new promise. Calling then returns it immediately; the handler's eventual completion determines its outcome.

| Handler behavior            | Outcome of next                             |
| --------------------------- | ------------------------------------------- |
| Returns ordinary value      | Fulfilled with that value                   |
| Reaches end without return  | Fulfilled with undefined                    |
| Throws                      | Rejected with the thrown reason             |
| Returns promise or thenable | Follows its eventual outcome                |
| Missing matching handler    | Propagates the preceding value or rejection |

See [MDN's then return-value rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#return_value).

### Exercise C: Transform Values, Then Forget a Return

```javascript
Promise.resolve(2)
  .then((value) => value * 3)
  .then((value) => {
    console.log(value);
  })
  .then((value) => console.log(value));
console.log("sync");
```

<details>
<summary>Reveal output</summary>

**sync, 6, undefined.** The second handler logs 6 but returns nothing. Its returned promise therefore fulfills with undefined, which reaches the third handler.

</details>

## 6. Chain Ordering: Track Each Promise

### Exercise D: Chaining vs Independent Handlers

```javascript
const base = Promise.resolve();
base.then(() => console.log("A")).then(() => console.log("B"));
base.then(() => console.log("C"));
queueMicrotask(() => console.log("Q"));
console.log("S");
```

<details>
<summary>Reveal output and microtask trace</summary>

**S, A, C, Q, B.** A and C depend on the already fulfilled base. B depends on the still-pending promise returned by the A handler's then call.

| Moment                                  | Ready microtasks, front to back |
| --------------------------------------- | ------------------------------- |
| Synchronous code finishes               | A, C, Q                         |
| A returns and fulfills its next promise | C, Q, B                         |
| C returns                               | Q, B                            |
| Q returns                               | B                               |
| B returns                               | Empty                           |

Registration order in the source is not enough. Draw dependencies and enqueue only ready reactions.

</details>

## 7. Returning Another Promise

Returning a promise from a handler makes downstream steps wait for its outcome, not block the thread. The next handler receives its fulfillment value rather than a nested promise object.

### Exercise E: Wait for Timer-Backed Work

```javascript
Promise.resolve("start")
  .then((value) => {
    console.log(value);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("timer");
        resolve(42);
      }, 0);
    });
  })
  .then((value) => console.log(value));
queueMicrotask(() => console.log("Q"));
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, start, Q, timer, 42.** The first handler creates and returns a pending promise. The chain follows it. The timer eventually fulfills it, allowing downstream reaction processing. Q does not wait for the timer-backed result.

</details>

### Exercise F: Missing Return Detaches the Work

```javascript
Promise.resolve()
  .then(() => {
    new Promise((resolve) => {
      setTimeout(() => {
        console.log("inner finishes");
        resolve("data");
      }, 0);
    });
  })
  .then((value) => console.log("next", value));
```

<details>
<summary>Reveal output and fix</summary>

**next undefined, inner finishes.** The first handler returns undefined instead of the inner promise. Add `return` before `new Promise` to make the next handler wait and receive data. Real detached operations also need their own error handling.

</details>

## 8. catch: Recovery or Propagation

`catch(handler)` is shorthand for `then(undefined, handler)`. A normal return recovers the chain; throwing keeps it rejected. A failure in a fulfillment handler rejects the promise returned by that then call, so a later catch can handle it.

### Exercise G: Throw, Recover, Continue

```javascript
Promise.resolve(1)
  .then(() => {
    throw new Error("failed");
  })
  .catch((error) => {
    console.log(error.message);
    return 99;
  })
  .then((value) => console.log(value));
queueMicrotask(() => console.log("Q"));
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, Q, failed, 99.** The throwing handler executes before Q but prints nothing. It enqueues the rejection handler behind Q. Recovery then schedules the final fulfillment handler. Some microtasks have no visible log.

</details>

<details>
<summary>Does then(onSuccess, onFailure) catch an error thrown by onSuccess?</summary>

Not with that same onFailure handler. Both handlers belong to the input promise; only one is chosen based on its state. An error thrown by onSuccess rejects the newly returned promise. Handle it with a downstream catch.

</details>

## 9. finally: Cleanup and Outcome Preservation

Finally receives no fulfillment value or rejection reason. Normal cleanup preserves the preceding outcome; returning an ordinary value does not replace it. A thrown error or rejected cleanup promise changes the downstream result to rejection. Returning a pending promise delays propagation until cleanup settles. See [MDN: finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally).

### Exercise H: Cleanup Does Not Replace a Value

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

**S, cleanup, original.** To transform the fulfillment value, use then. Finally is not interchangeable with a pair of ordinary then handlers; its internal promise adoption can also affect interleaving.

</details>

### Exercise I: Cleanup Failure Overrides Success

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

**S, cleanup failed.** Throwing in finally rejects the promise it returns.

</details>

## 10. Advanced Ordering: Promise Adoption Adds Work

Do not memorize "one written then equals one microtask" as a universal counting rule. Promise resolution may schedule internal jobs that print nothing.

### Exercise J: Return an Already Fulfilled Promise

```javascript
Promise.resolve()
  .then(() => {
    console.log("A");
    return Promise.resolve("B");
  })
  .then((value) => console.log(value));

queueMicrotask(() => {
  console.log("Q1");
  queueMicrotask(() => {
    console.log("Q2");
    queueMicrotask(() => console.log("Q3"));
  });
});
console.log("S");
```

<details>
<summary>Reveal output and internal steps for these native promises</summary>

**S, A, Q1, Q2, Q3, B.** Returning a fulfilled promise is not the same scheduling path as returning the string B directly.

| After                                                    | Waiting work, front to back |
| -------------------------------------------------------- | --------------------------- |
| Script finishes                                          | A, Q1                       |
| A returns a promise                                      | Q1, adoption job            |
| Q1 runs                                                  | adoption job, Q2            |
| Adoption job attaches a reaction to the returned promise | Q2, forwarding reaction     |
| Q2 runs                                                  | forwarding reaction, Q3     |
| Forwarding reaction fulfills the chain's promise         | Q3, B handler               |
| Q3 runs                                                  | B handler                   |

Change the return to the ordinary string `"B"` and predict again: **S, A, Q1, B, Q2, Q3**. The direct value fulfills the chain's promise without the adoption path shown above.

</details>

## 11. Resolved Can Still Be Pending

### Exercise K: Lock Into Another Promise

```javascript
let finish;
const inner = new Promise((resolve) => {
  finish = resolve;
});
const outer = new Promise((resolve, reject) => {
  resolve(inner);
  reject(new Error("ignored"));
});
outer.then((value) => console.log(value));
console.log("waiting");
setTimeout(() => finish("done"), 0);
```

<details>
<summary>Reveal output and the states before the timer</summary>

**waiting, done.** Outer is resolved to inner, but both remain pending until inner fulfills. The later reject attempt cannot override that decision. Outer eventually fulfills with done and schedules its handler.

</details>

## 12. Revision Checklist

- [ ] Define pending, fulfilled, rejected, settled, and resolved.
- [ ] Explain Promise.resolve for values, promises, and thenables.
- [ ] Separate synchronous executor work from asynchronous reactions.
- [ ] Explain what every then call returns.
- [ ] Predict returned values, missing returns, and thrown errors.
- [ ] Make a chain wait for another promise by returning it.
- [ ] Distinguish catch recovery from finally cleanup.
- [ ] Trace chain dependencies instead of queuing every handler at once.
- [ ] Account for internal promise-adoption jobs in advanced questions.
- [ ] Solve all eleven exercises and the modified return in Exercise J.

**Interview practice:** Explain Exercise D with a queue table, then explain why Exercises E and F differ. Finish with Exercise J only after those are clear.
