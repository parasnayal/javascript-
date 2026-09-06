# Browser APIs / Web APIs: Interview Notes

**Topic 3 | Prerequisites:** [JavaScript Runtime](../01-js-fundamentals/javascript-runtime.md) and [Call Stack](../01-js-fundamentals/call-stack.md). **Study time:** 30 minutes.

Predict outputs before expanding answers. Expandable sections work in Markdown viewers that support HTML details, including GitHub. The examples focus on browser behavior; Node.js supplies its own host implementations.

## 1. Your 30-Second Interview Answer

> Web APIs are interfaces provided by the browser that JavaScript can call to interact with the page and the outside world. The engine executes JavaScript, while the browser manages facilities such as timers, event delivery, and networking. Calling setTimeout registers a timer and returns; it does not leave a waiting function on the call stack. When eligible, the callback is scheduled and eventually executed by the engine.

## 2. Engine vs Browser

| Component          | Responsibility                                                                     |
| ------------------ | ---------------------------------------------------------------------------------- |
| JavaScript engine  | Execute expressions, function calls, and callback bodies; manage JavaScript memory |
| Browser host       | Supply DOM, timer, event, and networking APIs                                      |
| Browser scheduling | Coordinate tasks and microtask checkpoints                                         |

`Array`, `Object`, and `Promise` belong to the JavaScript standard. `document`, `setTimeout`, and `fetch` are host APIs. Some Web APIs also exist in workers or non-browser runtimes; availability depends on the environment.

**Web API does not mean asynchronous.** For example, reading `element.textContent` is synchronous. "API" means an interface, not a promise of background execution.

<details>
<summary>Interview question: Does V8 count down the seconds for setTimeout?</summary>

No. Your JavaScript calls a browser-provided timer API. The browser manages the timer using its host facilities. V8 executes the JavaScript callback when it is invoked later. Avoid claiming that every timer gets a dedicated thread.

</details>

## 3. setTimeout: Registration Is Different from Execution

```javascript
console.log("start");
setTimeout(() => console.log("timer"), 20);
console.log("end");
```

<details>
<summary>Reveal output and timer lifecycle</summary>

**start, end, timer.** The call registers a one-shot timer and returns a timer ID. After the required wait, its callback can run as a task when scheduling permits. Delay is not an exact execution time. See [MDN: setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout).

```text
Now: JavaScript calls setTimeout(callback, delay)
                         |
                         v
Browser registers timer; API returns
                         |
              Current JavaScript continues

Later: timer becomes eligible
                         |
                         v
                 Timer task can run
                         |
                         v
           Engine executes callback on stack
```

There is no sleeping JavaScript frame occupying the stack throughout the delay. The browser retains the callback information until it is used or canceled.

</details>

### Why Can a Timer Be Late?

A busy JavaScript thread, pending work, or browser throttling can delay execution. Background tabs may receive less frequent timer execution. Browsers also clamp sufficiently nested short timers. A delay of zero does not interrupt current synchronous code. Exact throttling policies vary. See [MDN's timer delay explanation](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#reasons_for_delays_longer_than_specified).

### Exercise A: Cancel a Timer

```javascript
const timerId = setTimeout(() => console.log("expired"), 0);
clearTimeout(timerId);
console.log("canceled");
```

<details>
<summary>Reveal output</summary>

**canceled** only. The pending timer is canceled before its callback starts. Cancellation does not interrupt a callback that is already executing.

</details>

<details>
<summary>Interview question: Why can a zero-delay timer wait behind five seconds of computation?</summary>

The computation occupies the same JavaScript thread. The timer's waiting happens outside the stack, but its JavaScript callback still needs an execution opportunity on that thread after the current work finishes.

</details>

## 4. setInterval: Repeated Scheduling

`setInterval` requests repeated callback execution until canceled. It does not guarantee precise clock ticks. `clearInterval` stops future executions. See [MDN: setInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval).

### Exercise B: Stop After Three Ticks

```javascript
let count = 0;
const intervalId = setInterval(() => {
  count += 1;
  console.log(count);
  if (count === 3) clearInterval(intervalId);
}, 20);
```

<details>
<summary>Reveal output and timing guarantee</summary>

**1, 2, 3**, then it stops. Do not promise that the logs occur at exactly 20, 40, and 60 milliseconds.

</details>

<details>
<summary>4-year interview question: Can interval callbacks overlap?</summary>

Their synchronous JavaScript does not execute simultaneously on the same thread. However, an interval can start a second network request before the first finishes. An `async` callback does not make `setInterval` wait for its returned promise. For sequential polling, schedule a new timeout after the previous operation settles, with a stop condition and error handling. See [MDN's interval polling guidance](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency).

</details>

## 5. DOM Events

`addEventListener` registers a handler; registration itself does not invoke the handler. The browser handles user input and dispatches events. Listeners run JavaScript when the event is dispatched. A long synchronous task can delay responding to a real user click.

### Browser Practice: One Click Only

Run this snippet on a test page. It creates its own button. Click it twice.

```javascript
const button = document.createElement("button");
button.textContent = "Practice click";
document.body.append(button);
button.addEventListener("click", () => console.log("clicked"), {
  once: true,
});
console.log("registered");
```

<details>
<summary>Reveal expected behavior and cleanup</summary>

Registration logs **registered**. The first click logs **clicked**; the second does not, because the listener was registered with `once: true`. Remove the practice button afterward with `button.remove()`. In application code, also remove persistent listeners when their owner is disposed, using the original callback reference or an abort signal.

</details>

### Exercise C: Not Every Event Is Asynchronous

```javascript
const target = new EventTarget();
target.addEventListener("practice", () => console.log("listener"));
console.log("before");
target.dispatchEvent(new Event("practice"));
console.log("after");
```

<details>
<summary>Reveal the important exception</summary>

**before, listener, after.** `dispatchEvent()` invokes listeners synchronously before returning. Do not assume every event handler waits for a later task. Browser-delivered input and explicit synchronous dispatch are different cases. See [MDN: dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).

</details>

## 6. fetch: Browser Networking, JavaScript Promises

`fetch` starts a request and returns a promise. The browser manages networking; JavaScript does not hold a waiting call frame for the response. A fulfilled fetch promise provides a `Response`; consuming its body with `response.json()` is another asynchronous operation. Promise handlers run as microtasks when eligible.

HTTP errors such as 404 or 500 normally fulfill the fetch promise with a response. Check `response.ok`. Network failures and aborts can reject the promise. Browser requests are also subject to policies such as CORS. See [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

### Exercise D: Read JSON Without an External Server

This uses a data URL to demonstrate response handling without relying on a live API. It does not test real network latency or CORS.

```javascript
console.log("request starts");
fetch('data:application/json,{"topic":"Web APIs"}')
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => console.log(data.topic))
  .catch((error) => console.log(error.message));
console.log("script continues");
```

<details>
<summary>Reveal successful output</summary>

**request starts, script continues, Web APIs.** The handlers run after the current synchronous code. Returning `response.json()` makes the next handler receive the parsed data. In a real request, cancellation can be implemented by passing an `AbortController` signal to `fetch` and calling `abort()` when needed.

</details>

<details>
<summary>Interview trap: Does fetch always finish before setTimeout because promises have priority?</summary>

No. Networking and timers become ready independently. Microtask scheduling matters once a promise reaction is queued; a pending network response does not create a ready reaction. Do not predict request-vs-timer completion order without additional guarantees.

</details>

## 7. Compare the APIs

| API                | Immediate effect                   | Later behavior                              | Cleanup                                        |
| ------------------ | ---------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| `setTimeout`       | Register timer; return ID          | One callback opportunity                    | `clearTimeout`                                 |
| `setInterval`      | Register repeated timer; return ID | Repeated callback opportunities             | `clearInterval`                                |
| `addEventListener` | Register listener                  | Handler runs when event is dispatched       | `removeEventListener`, `once`, or abort signal |
| `fetch`            | Start request; return promise      | Response handling through promise reactions | Abort request with `AbortController`           |

## 8. Interview Mistakes to Avoid

| Incorrect claim                                                 | Better explanation                                                      |
| --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| "setTimeout is an ECMAScript feature."                          | It is a host API exposed to JavaScript.                                 |
| "The timer sleeps on the stack."                                | Registration returns; the browser manages the waiting.                  |
| "Web APIs always run asynchronously."                           | Some APIs and event dispatches are synchronous.                         |
| "The browser executes my callback independently of JavaScript." | The engine executes the callback when the host schedules or invokes it. |
| "Intervals wait for async callbacks."                           | They do not await the returned promise.                                 |
| "fetch rejects on every HTTP error."                            | Check the response status explicitly.                                   |

## 9. Revision Checklist

- [ ] Explain browser capabilities versus engine responsibilities.
- [ ] Describe timer registration, waiting, and callback execution separately.
- [ ] Explain why a timer does not occupy the stack while waiting.
- [ ] Cancel a timeout and stop an interval.
- [ ] Explain delayed timers and overlapping asynchronous interval work.
- [ ] Distinguish listener registration from event dispatch.
- [ ] Predict synchronous `dispatchEvent` output.
- [ ] Explain fetch response handling and HTTP error checks.
- [ ] Explain why request completion order cannot be inferred from queue priority.

**Next:** Event loop, tasks, and microtasks. First explain the timer lifecycle aloud without using the phrase "JavaScript waits."
