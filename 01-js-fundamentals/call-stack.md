# Call Stack: Interview Notes

**Topic 2 | Prerequisite:** [JavaScript Runtime](javascript-runtime.md). **Study time:** 30 minutes.

Predict each answer aloud before expanding it. These notes cover synchronous execution first; event-loop scheduling comes later. Expandable answers work in Markdown viewers that support HTML details, including GitHub.

## 1. Your 30-Second Interview Answer

> The call stack tracks active function calls using last in, first out order. When a function is called, its execution context becomes the active context. If it calls another function, the caller waits while the new call executes. When that call returns, its context is removed and the caller resumes. Excessively deep calls can exceed the stack limit and cause a stack overflow.

## 2. LIFO: Last In, First Out

Think of a stack of plates: add and remove from the top.

| Operation | Meaning       | Stack, bottom to top |
| --------- | ------------- | -------------------- |
| Push A    | Add A         | A                    |
| Push B    | Add B above A | A, B                 |
| Push C    | Add C above B | A, B, C              |
| Pop       | Remove C      | A, B                 |
| Pop       | Remove B      | A                    |

The top represents the currently executing call. Lower calls wait to resume. A call stack is not a queue: the oldest call does not finish first simply because it started first. See [MDN: Call stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack).

<details>
<summary>Quick check: A calls B, then B calls C. Which returns first?</summary>

C returns first, then B can continue, then A can continue. This assumes ordinary synchronous calls that return normally.

</details>

## 3. Execution Contexts

An execution context is the specification's model of the information needed to execute code. It is not just an object containing variables. Engines implement and optimize this model internally.

| Context                    | Purpose                                      |
| -------------------------- | -------------------------------------------- |
| Global execution context   | Evaluates top-level code in a classic script |
| Function execution context | Executes a particular function invocation    |

A function invocation has parameters, local bindings, access to its lexical environment, and information needed to continue execution. Ordinary functions also establish `this` according to how they are called; arrows use lexical `this`.

**Declaration is not invocation.** Defining a function does not run its body. Calling it creates an invocation; repeated calls have distinct execution state.

The walkthroughs use **G** for classic-script top-level execution. Modules and Node.js CommonJS have different top-level arrangements. When script evaluation completes, its context leaves the active stack; global bindings can still exist. See [MDN: Execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model).

<details>
<summary>Interview trap: Does a block create a new function call on the stack?</summary>

No. An `if` block or loop can introduce lexical scope without invoking a function. Scope and call-stack depth are different concepts.

</details>

## 4. Walk Through Nested Calls

```javascript
function second() {
  console.log("second");
}

function first() {
  console.log("first starts");
  second();
  console.log("first ends");
}

console.log("script starts");
first();
console.log("script ends");
```

Before revealing: write the output and draw the stack while `second` is running.

<details>
<summary>Reveal output</summary>

```text
script starts
first starts
second
first ends
script ends
```

</details>

<details>
<summary>Reveal stack changes, one step at a time</summary>

The table omits brief `console.log` calls and host internals to focus on your functions.

| Step | Action                                       | Stack, bottom to top |
| ---- | -------------------------------------------- | -------------------- |
| 1    | Start script; define functions               | G                    |
| 2    | Log script starts                            | G                    |
| 3    | Call first; log first starts                 | G, first             |
| 4    | first calls second                           | G, first, second     |
| 5    | second logs and reaches its end              | G, first, second     |
| 6    | second returns undefined; pop second         | G, first             |
| 7    | first logs first ends and returns; pop first | G                    |
| 8    | Log script ends; finish script               | Empty                |

At the deepest point, before logging:

```text
TOP     +------------------+
        | second() active  |
        +------------------+
        | first() waiting  |
        +------------------+
BOTTOM  | G waiting        |
        +------------------+
```

`first` resumes immediately after its call to `second`. JavaScript does not restart `first` or skip its remaining statements.

</details>

## 5. Returns and Synchronous Execution

Ordinary synchronous code proceeds in execution order. A caller cannot use a returned value until the called function completes. Reaching the end of a function without an explicit return produces `undefined`.

### Exercise A: Follow the Return Value

```javascript
function double(number) {
  return number * 2;
}

function calculate() {
  const result = double(4);
  return result + 1;
}

console.log(calculate());
```

<details>
<summary>Reveal answer and call sequence</summary>

**9.** `calculate` calls `double(4)`. `double` returns 8 and leaves the stack. `calculate` resumes, stores 8, then returns 9. Only after the argument expression finishes does `console.log` receive 9. A function mentioned outside another call expression does not necessarily enter first; arguments must be evaluated before that invocation.

</details>

### Exercise B: Callbacks Can Be Synchronous

```javascript
function visit(value) {
  console.log(value);
}

console.log("before");
[1, 2].forEach(visit);
console.log("after");
```

<details>
<summary>Reveal answer: does visit wait in a queue?</summary>

**before, 1, 2, after.** `forEach` invokes each callback synchronously. Each invocation returns before the next starts. Passing a function as an argument does not by itself make execution asynchronous.

</details>

## 6. Recursion and Stack Overflow

Recursion means a function calls itself, directly or through other functions. Each ordinary nested invocation needs its own execution state.

### Exercise C: Trace Both Descent and Return

```javascript
function countDown(number) {
  console.log("enter", number);
  if (number === 0) return;
  countDown(number - 1);
  console.log("leave", number);
}

countDown(2);
```

<details>
<summary>Reveal output and deepest stack</summary>

```text
enter 2
enter 1
enter 0
leave 1
leave 2
```

Deepest user-code stack: **G, countDown(2), countDown(1), countDown(0)**. The base case returns before the last log, so there is no `leave 0`. Each waiting call retains its own `number`.

</details>

### Why Overflow Happens

If a function continually calls itself without returning, nested calls accumulate. Engines impose stack limits. In Chrome and Node.js, a typical error is `RangeError: Maximum call stack size exceeded`; Firefox may report `InternalError: too much recursion`. See [MDN: Too much recursion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion).

Conceptual broken example: `function repeat() { repeat(); }`, followed by `repeat()`.

<details>
<summary>Interview question: Is adding a base case always enough?</summary>

No. The input must move toward the base case, and a finite but very deep recursion can still exceed the stack limit. Validate inputs, bound the depth, or use iteration when depth can be large. Do not rely on tail-call optimization across all engines or quote one universal maximum recursion depth.

</details>

<details>
<summary>Interview question: Does a long loop always cause stack overflow?</summary>

No. A loop that does not build nested calls can run for a long time without growing call-stack depth. It can still block the thread. Stack overflow concerns call depth; blocking concerns how long the thread remains occupied.

</details>

## 7. When a Function Throws

An error can exit calls before normal completion. JavaScript searches for a matching handler as execution unwinds; applicable `finally` blocks run along the way.

### Exercise D: Trace Error Unwinding

```javascript
function fail() {
  throw new Error("Something failed");
}

function run() {
  try {
    fail();
    console.log("after fail");
  } finally {
    console.log("cleanup");
  }
}

try {
  run();
} catch (error) {
  console.log("caught");
}
console.log("done");
```

<details>
<summary>Reveal output and explain the skipped line</summary>

**cleanup, caught, done.** `fail` throws instead of returning normally. `after fail` is skipped. `run` executes its `finally` block, then the error reaches the outer catch. Execution continues after that handler.

</details>

## 8. Debugger Practice

1. Run the nested-call example in a browser DevTools Snippet.
2. Set a breakpoint on the log inside `second`.
3. Run and inspect the Call Stack panel: find `second`, then `first`, then the script entry.
4. Select `first` to inspect the waiting caller's location.
5. Step out of `second`; confirm execution resumes in `first`.

Frame labels vary by tool. **Step into** enters a call, **step over** executes a call without entering its body in the debugger, and **step out** continues until the current function exits.

## 9. Interview Follow-Ups

<details>
<summary>Does removing a frame destroy everything created by that function?</summary>

No. An object or lexical binding that is still reachable, for example through a returned closure, can remain alive. An active call frame and retained lexical state are different things. Returning removes the active invocation, not every value it touched.

</details>

<details>
<summary>Is the call stack the same as the scope chain?</summary>

No. The call stack represents active calls and where execution resumes. The scope chain determines how variable names are resolved from where functions were defined. The function that calls you does not automatically supply your lexical scope.

</details>

<details>
<summary>Why learn this before the event loop?</summary>

You must first know how code starts, calls other functions, and completes. Later scheduling rules explain when new work gets an execution opportunity; they do not change how ordinary synchronous nested calls execute.

</details>

## 10. Revision Checklist

- [ ] Explain LIFO and distinguish a stack from a queue.
- [ ] Explain global and function execution contexts.
- [ ] Distinguish declaring a function from invoking it.
- [ ] Draw every push and pop in the nested-call walkthrough.
- [ ] Predict the return-value and synchronous-callback exercises.
- [ ] Trace recursion on the way down and back up.
- [ ] Explain why a base case does not guarantee stack safety.
- [ ] Distinguish stack overflow from a long-running loop.
- [ ] Explain error unwinding and retained closure state.

**Readiness check:** Explain the nested-call example without looking at the notes. Then use the debugger to verify your drawing before moving on to event-loop scheduling.
