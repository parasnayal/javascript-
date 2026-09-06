# setTimeout(): Interview Notes

**Topic 10 | Prerequisites:** [Event Loop](event-loop.md), [Promises](promises-and-event-loop.md), and [queueMicrotask](queue-microtask.md). **Study time:** 30 minutes.

Predict outputs before expanding answers. Run snippets independently. Expandable answers work in Markdown viewers that support HTML details, including GitHub. Browser rules are the default; Node.js differences are called out separately.

## 1. Your 30-Second Interview Answer

> setTimeout registers a one-shot timer with the host and returns immediately. The host manages waiting; the callback does not remain on the JavaScript stack. After the effective delay, a timer task can invoke the callback when scheduling permits. The delay is not an exact execution guarantee. Even zero-delay callbacks wait for current synchronous work and applicable microtask checkpoints. A nested timeout registers new later work when the outer callback reaches that call.

## 2. Follow the Timer Lifecycle

1. JavaScript calls `setTimeout(callback, delay)`.
2. The host registers the timer and returns a handle.
3. JavaScript continues; host-managed waiting proceeds separately.
4. After the timer's waiting requirements, a task is queued on the timer task source.
5. When selected, that task invokes the callback and the engine executes its body.

The browser supplies timers, not the ECMAScript language. There is no dedicated JavaScript thread per timer. See the [HTML timer algorithm](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers).

```text
Registration          Waiting                 Execution

setTimeout(fn, d) ---> Host timer ---> Timer task ---> fn on stack
        |
        +-- Return handle; current code continues
```

The task queue holds eligible scheduled work; it is not a room where a running JavaScript function sleeps for the entire delay.

## 3. Minimum Delay vs Guaranteed Time

For a valid ordinary delay, think **"not before the effective waiting threshold, and possibly later"**, not "at exactly this time." Input conversion, timer nesting, and host policies can alter the effective delay.

| Cause                                   | Consequence                                            |
| --------------------------------------- | ------------------------------------------------------ |
| Long synchronous computation            | Callback cannot interrupt that work                    |
| Microtasks continuously queued          | Timer execution can be starved                         |
| Other runnable tasks                    | Timer is not guaranteed the next execution opportunity |
| Background-tab throttling or suspension | Wall-clock waiting can be much longer                  |
| Nested short browser timers             | A minimum delay can be imposed                         |

Avoid relying on string, negative, or oversized delay inputs; provide a sensible numeric delay. Browser timer behavior is documented in [MDN: setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout).

<details>
<summary>Interview question: A 100 ms timeout is followed by 500 ms of synchronous work. Does the callback wait another 100 ms afterward?</summary>

Not because the stack was busy. Timer waiting starts with registration, not after synchronous work finishes. It can already be eligible when the computation ends, but execution may still be delayed by scheduling. Neither an exact 500 ms nor 600 ms callback time is guaranteed.

</details>

## 4. Zero Delay Still Schedules Later Work

### Exercise A: Direct vs Deferred

```javascript
function log() {
  console.log("callback");
}
console.log("start");
setTimeout(log, 0);
log();
console.log("end");
```

<details>
<summary>Reveal output</summary>

**start, callback, end, callback.** The direct call runs now. The timer callback runs in a later task. Zero does not remove that scheduling boundary.

</details>

### Exercise B: Synchronous Work Finishes First

```javascript
setTimeout(() => console.log("timer"), 0);
let total = 0;
for (let number = 1; number <= 1000; number += 1) {
  total += number;
}
console.log(total);
console.log("done");
```

<details>
<summary>Reveal output</summary>

**500500, done, timer.** The small loop illustrates ordering without a long freeze. Increasing its workload would delay the callback, not allow it to interrupt execution.

</details>

## 5. setTimeout vs Promise

| Feature                        | setTimeout                              | Promise handler                            |
| ------------------------------ | --------------------------------------- | ------------------------------------------ |
| Purpose                        | Schedule a one-shot timer               | React to an eventual outcome               |
| Callback scheduling in browser | Timer task                              | Microtask reaction when ready              |
| Delay argument                 | Yes                                     | No                                         |
| Return                         | Timer handle                            | then returns a new promise                 |
| Completion                     | Callback return is ignored by timer API | Handler return determines the next promise |

Promises do not themselves measure delays. A pending promise has no ready fulfillment reaction merely because its handler was registered early.

### Exercise C: Ready Promise Beats Timer

```javascript
setTimeout(() => console.log("T"), 0);
Promise.resolve().then(() => console.log("P"));
queueMicrotask(() => console.log("Q"));
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, P, Q, T.** P and Q drain as ready microtasks before the next timer task. This does not imply that every promise, including one waiting for a network response, completes before every timer.

</details>

### Exercise D: A Timer Can Settle a Promise

```javascript
function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

delay(0).then(() => console.log("after delay"));
queueMicrotask(() => console.log("Q"));
console.log("S");
```

<details>
<summary>Reveal output and the two scheduling stages</summary>

**S, Q, after delay.** The timer first invokes resolve as task work. This settles the promise and makes its reaction ready for microtask processing. The promise wrapper does not turn the timer itself into a microtask or guarantee an exact duration.

</details>

## 6. Nested setTimeout

### Exercise E: New Timer, New Later Task

```javascript
setTimeout(() => {
  console.log("outer starts");
  setTimeout(() => console.log("inner"), 0);
  Promise.resolve().then(() => console.log("P"));
  console.log("outer ends");
}, 0);
console.log("S");
```

<details>
<summary>Reveal output and nesting behavior</summary>

**S, outer starts, outer ends, P, inner.** The inner timer is registered during the outer callback, not during initial script execution. It cannot interrupt the outer callback. The promise reaction runs at the following checkpoint before the inner task.

The inner callback is not a synchronous recursive call: the outer callback has returned before the inner executes.

</details>

### Browser Nesting Clamp

Under the HTML timer algorithm, when the inherited timer nesting level is greater than 5, a requested timeout below 4 ms is raised to 4 ms. This is a timer-nesting rule, not a claim that every zero-delay timeout waits 4 ms. Nesting can involve timers created by timer callbacks, including interval-related timer processing. Real delays can be longer. See the [HTML timer initialization steps](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timer-initialisation-steps).

### Exercise F: Bounded Repeated Timeouts

```javascript
let count = 0;
function tick() {
  count += 1;
  console.log(count);
  if (count < 3) setTimeout(tick, 0);
}
setTimeout(tick, 0);
console.log("registered");
```

<details>
<summary>Reveal output; does the call stack grow on every tick?</summary>

**registered, 1, 2, 3.** Every callback returns before the next begins, so this does not accumulate synchronous recursive frames. Timing is not exact. Scheduling subsequent polling only after an operation completes can avoid overlapping requests, unlike a fixed interval that does not await its async callback.

</details>

## 7. Cancellation and Callback Context

### Exercise G: Cancel During a Microtask

```javascript
const id = setTimeout(() => console.log("expired"), 0);
queueMicrotask(() => {
  clearTimeout(id);
  console.log("canceled");
});
console.log("S");
```

<details>
<summary>Reveal output</summary>

**S, canceled.** The microtask cancels the timer before its callback executes. Cancellation does not interrupt an already executing callback or undo work it has done.

</details>

### Exercise H: Preserve the Method Receiver

```javascript
const person = {
  name: "Paras",
  greet() {
    console.log(this.name);
  },
};
setTimeout(() => person.greet(), 0);
console.log("scheduled");
```

<details>
<summary>Reveal output; why use the wrapper?</summary>

**scheduled, Paras.** The wrapper calls the method with person as its receiver. Passing `person.greet` directly does not retain that receiver. `person.greet.bind(person)` is another option. Avoid assuming the host-provided callback this value is identical in browsers and Node.js.

</details>

## 8. Browser vs Node.js

Browsers return a numeric timer ID; Node.js returns a Timeout object and implements its own event-loop timer behavior. Node.js normalizes delays below 1 ms to 1 ms and does not guarantee exact callback timing. Browser nesting and background-tab rules do not describe Node.js. See [Node.js timer documentation](https://nodejs.org/api/timers.html#settimeoutcallback-delay-args).

## 9. Interview Follow-Ups

<details>
<summary>Can I use a timeout as proof that another operation has finished?</summary>

No. Waiting an arbitrary duration is not synchronization. Use the operation's promise, callback, or completion event. A timer can define a timeout policy, but racing against a timer does not automatically cancel the underlying operation.

</details>

<details>
<summary>Does moving expensive work into a timer make it non-blocking?</summary>

It changes when the work starts. Once the callback runs, its synchronous computation still blocks that thread. Use bounded chunks or suitable worker computation when necessary. A zero-delay timeout also does not guarantee a paint before the callback.

</details>

<details>
<summary>Does setTimeout return the callback's result, or catch its eventual errors?</summary>

No. It returns a timer handle. Handle expected errors inside the callback or report completion through a promise-based wrapper. A try/catch around timer registration does not catch a later exception thrown by its callback. An async timer callback's returned promise is also ignored by the timer API.

</details>

## 10. Revision Checklist

- [ ] Describe registration, host waiting, task scheduling, and callback execution.
- [ ] Explain effective minimum delay versus exact execution time.
- [ ] Explain why zero delay cannot interrupt synchronous code.
- [ ] Trace ready promise reactions before a timer task.
- [ ] Explain a promise whose fulfillment depends on a timer.
- [ ] Trace nested timers and the browser nesting clamp.
- [ ] Cancel a timer and preserve a method receiver.
- [ ] Distinguish browser and Node.js timer behavior.
- [ ] Predict all eight outputs without inventing exact timestamps.

**Interview practice:** Explain Exercises C-E with separate lists for registered timers, runnable task work, and ready microtasks.
