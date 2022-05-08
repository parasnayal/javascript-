// console.log(" This tutorial is all about the iterators in javascript ");

console.log(" This tutorial is all about the iterators in javascript ");

// Iteration protocols =>There are two iteration protocols: iterable protocol and iterator protocol.

// Iterator protocol => an object is qualified as an iterator when it has a next() method that returns an object with two properties:
// done: a boolean value indicating whether or not  there are any more elements that could be iterated upon.
// value: the current element.

// Iterable protocol => An object is iterable when it contains a method called [Symbol.iterator] that takes no argument and returns an object which conforms to the iterator protocol.

const array = ["paras", "nayal", "rohan", "bhuwan", "Kishor"];
console.log(array);
function Iterator(array) {
    let nextIndex = 0
    return {
        next: function () {
            if (nextIndex < array.length) {
                return {
                    value: array[nextIndex++],
                    done: false
                }
            }
            else {
                return {
                    done: true
                }
            }
        }
    }
}
let result = Iterator(array);
console.log(result.next().value);
console.log(result.next().value);
console.log(result.next().value);
console.log(result.next().value);
console.log(result.next().value);
console.log(result.next().value);