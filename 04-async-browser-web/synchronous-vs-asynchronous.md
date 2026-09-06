# Synchronous vs Asynchronous JavaScript: Interview Notes

**Topic 4 | Prerequisite:** [Browser APIs / Web APIs](browser-web-apis.md). **Study time:** 30 minutes.

Predict each output before expanding its answer. Run examples independently. Expandable answers work in Markdown viewers that support HTML details, including GitHub. Queue ordering is deliberately left for the next topic.

## 1. Your 30-Second Interview Answer

> Synchronous calls complete before their caller continues. Asynchronous operations let the caller continue before the operation's result is available, then deliver that result through a callback or promise. This helps keep a page responsive while waiting for I/O. It does not make JavaScript callbacks run in parallel on one thread, and expensive synchronous computation can still block that thread.

## 2. Compare the Concepts

| Concept                | Meaning                                                                  | Example                        |
| ---------------------- | ------------------------------------------------------------------------ | ------------------------------ |
| Synchronous execution  | A call finishes before the caller proceeds                               | Computing a small sum          |
| Asynchronous execution | Completion is handled later; the caller can continue                     | Waiting for a network response |
| Blocking work          | Keeps a thread occupied or waiting, preventing other work on that thread | A long calculation             |
| Non-blocking behavior  | Does not hold the calling thread while waiting for completion            | Asynchronous network I/O       |

Synchronous code is not inherently bad. Short calculations are normally synchronous. The responsiveness problem is spending too long without allowing other work to run. Asynchrony separates starting an operation from handling its completion. See [MDN: Introducing asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing).

## 3. Synchronous Execution

### Exercise A: Follow the Calls

```javascript
function calculateTotal(price, quantity) {
  console.log("calculating");
  return price * quantity;
}

console.log("start");
const total = calculateTotal(100, 2);
console.log(total);
console.log("end");
```

<details>
<summary>Reveal output and explanation</summary>

**start, calculating, 200, end.** The call to `calculateTotal` completes before the assignment finishes. The caller then continues. Nested function calls are still synchronous; execution follows control flow rather than simply reading every physical line from top to bottom.

</details>

## 4. Asynchronous Execution

### Exercise B: Start Now, Handle Completion Later

```javascript
console.log("start");
setTimeout(() => console.log("completed"), 20);
console.log("continue");
```

<details>
<summary>Reveal output and timeline</summary>

**start, continue, completed.** Registering the timer is an immediate operation. The host manages the wait, and the callback runs later. The callback's own statements then execute synchronously on its JavaScript thread.

```text
Time ------------------------------------------------------>

JS thread:  log start -> register timer -> log continue
                                                    ... -> callback
Host:                    [manage timer wait] -> eligible
```

The delay is not an exact execution guarantee. Completing a wait and executing its callback are separate events.

</details>

## 5. Blocking vs Non-Blocking

A large loop, expensive sort, or large synchronous JSON parse can occupy the JavaScript thread. On a browser's main thread, long tasks delay JavaScript input handlers and rendering work. In a server, a busy event-loop thread can delay other requests.

Non-blocking I/O allows the host to manage waiting while JavaScript can do other work. It does not mean the operation costs nothing, or that its result handler cannot block. See [MDN's explanation of long-running synchronous work](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing#the_trouble_with_long-running_synchronous_functions).

### Exercise C: A Timer Cannot Interrupt Computation

```javascript
setTimeout(() => console.log("timer"), 0);

let total = 0;
for (let number = 1; number <= 10000; number += 1) {
  total += number;
}

console.log(total);
console.log("loop finished");
```

<details>
<summary>Reveal output; would a larger loop change the order?</summary>

**50005000, loop finished, timer.** The deliberately small loop illustrates execution order without a long freeze. A larger finite loop would take longer, but the callback would still wait for the current synchronous work to complete.

</details>

<details>
<summary>Interview trap: Does setTimeout(() => expensiveWork(), 0) make expensiveWork non-blocking?</summary>

It defers when the work starts. Once the callback begins, a long synchronous calculation still occupies that thread. For substantial CPU work, consider a worker or splitting the calculation into bounded tasks that yield between chunks.

</details>

## 6. Why Asynchronous Behavior Is Necessary

Imagine a search page waiting for a response from a slow server. A blocking wait on the main thread would prevent other JavaScript handlers from responding. An asynchronous request allows other work while the response is pending.

| Situation            | Benefit                                 | Responsibility that remains          |
| -------------------- | --------------------------------------- | ------------------------------------ |
| Search request       | User can keep interacting while waiting | Ignore stale results; handle failure |
| File or database I/O | Other work can proceed during the wait  | Handle errors and cancellation       |
| Timer or user event  | No busy-wait loop is needed             | Keep the eventual callback short     |

**Concurrency is not parallelism.** Multiple operations can be in progress without their JavaScript handlers executing simultaneously on the same thread.

## 7. Callback Functions

A callback is a function passed to another function to be invoked by that function or its associated operation. **The receiving API determines when it runs.** A callback can be synchronous or asynchronous. See [MDN: Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function).

### Exercise D: A Synchronous Callback

```javascript
function applyOperation(value, callback) {
  return callback(value);
}

console.log("before");
const result = applyOperation(5, (value) => value * 2);
console.log(result);
console.log("after");
```

<details>
<summary>Reveal output; why is this synchronous?</summary>

**before, 10, after.** `applyOperation` invokes its callback directly before returning. Passing a function does not schedule it automatically. Array methods such as `map` and `forEach` also invoke their callbacks synchronously.

</details>

### Exercise E: Returning Too Early

```javascript
function getName() {
  let name;
  setTimeout(() => {
    name = "Paras";
    return name;
  }, 20);
  return name;
}

console.log(getName());
```

<details>
<summary>Reveal output and explain both returns</summary>

**undefined.** The outer function returns before the timer callback runs. Returning inside the callback returns from that callback, not from `getName`. A later assignment cannot retroactively change the value already returned.

</details>

### Exercise F: Deliver the Result Through a Callback

```javascript
function getName(onComplete) {
  setTimeout(() => {
    onComplete("Paras");
  }, 20);
}

getName((name) => console.log(name));
console.log("request registered");
```

<details>
<summary>Reveal output and explain the fix</summary>

**request registered, Paras.** The result-dependent code runs inside the completion callback. This sample simulates success with a timer; a real API also needs a defined failure contract. Promises are another way to represent eventual results and failures.

</details>

## 8. Callback Contracts and Errors

<details>
<summary>What is an error-first callback?</summary>

A common Node.js convention is `(error, result)`: the first argument indicates failure, otherwise the second carries the result. It is a convention, not a language rule or the signature of every callback. DOM listeners, for example, receive an event.

</details>

<details>
<summary>Will try/catch around setTimeout catch an error thrown later inside its callback?</summary>

No. The surrounding synchronous call has finished by the time that callback runs. Catch the error inside the callback or report failure through the API's error contract. For a promise-based operation, use `.catch()` or await it inside `try/catch`. Merely starting the operation inside a try block does not catch future failures.

</details>

<details>
<summary>What is callback hell, and what problem does it describe?</summary>

Deeply nested dependent callbacks can make sequencing, errors, and cleanup difficult to follow. Named functions and smaller responsibilities can help. Promises and async/await often make dependencies clearer, but do not remove the need to handle failure or choose the right ordering.

</details>

## 9. A Small async/await Preview

The `async` keyword makes a function return a promise. Its body starts synchronously; `await` suspends that function's continuation, not the entire thread. An async function with no await runs its body synchronously. See [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

### Exercise G: async Does Not Mean Another Thread

```javascript
async function calculate() {
  console.log("inside");
  return 42;
}

console.log("before");
const result = calculate();
console.log(result instanceof Promise);
console.log("after");
```

<details>
<summary>Reveal output</summary>

**before, inside, true, after.** The function body executes during the call, and the returned value is wrapped in a promise. Adding `async` to a CPU-heavy function does not move its computation to another thread.

</details>

## 10. Interview Follow-Ups

<details>
<summary>Can asynchronous requests finish in a different order from how they started?</summary>

Yes. Independent requests can take different amounts of time. If an earlier search request finishes after a newer one, blindly rendering it can show stale results. Track which request is current or cancel obsolete requests. Starting order alone does not guarantee completion order.

</details>

<details>
<summary>Should every operation be asynchronous?</summary>

No. Ordinary short computations are naturally synchronous. Use asynchronous APIs for waiting, and choose a separate strategy for expensive computation. Adding asynchronous boundaries unnecessarily complicates control flow and error handling.

</details>

## 11. Revision Checklist

- [ ] Explain synchronous vs asynchronous completion in 30 seconds.
- [ ] Distinguish long blocking work from a short synchronous calculation.
- [ ] Explain why non-blocking I/O helps responsiveness.
- [ ] Give one synchronous and one asynchronous callback example.
- [ ] Explain why returning from a later callback cannot return from its caller.
- [ ] Place result-dependent work in the completion path.
- [ ] Explain where errors from later work must be handled.
- [ ] Explain why async or setTimeout does not offload CPU work.
- [ ] Distinguish request start order from completion order.

**Next:** Queues and the event loop. First predict all seven exercises without referring to queue priority rules.
