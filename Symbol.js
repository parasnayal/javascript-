console.log(" This tutorial is all about the Symbol in javascript ");
// Symbols are immutable (cannot be changed) and are unique.

// Returns a new unique Symbol value.
let a = Symbol("paras");
console.log(a);
let b = Symbol("paras");
console.log(b);
console.log(typeof b);
console.log(a===b);

// ES6 provides you with the global symbol registry that allows you to share symbols globally. If you want to create a symbol that will be shared, you use the Symbol.for() method instead of calling the Symbol() function.
let ssn = Symbol.for('ssn');
let citizenID = Symbol.for('ssn');
console.log(ssn === citizenID); // true
console.log(Symbol.keyFor(citizenID));


console.log("======> Usage of the symbol <======");
// (A) Using symbols as unique values
// To get all property symbols of an object, you use the Object.getOwnPropertySymbols() method,The Object.getOwnPropertySymbols() method returns an array of own property symbols from an object.

console.log("===> Important part <===");
// The Symbol.iterator specifies whether a function will return an iterator for an object.
// The objects that have Symbol.iterator property are called iterable objects.
// In ES6, all collection objects (Array, Set and Map) and strings are iterable objects.

const array = [10,20,30,40,50];
console.log(array);
console.log(array[Symbol.iterator]());
let iterator = array[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);

let k1 = Symbol();
let k2 = Symbol();
const obj = {}
obj[k1] = "paras"
obj[k2] = "nayal"
obj.age=23
// symbols are ignore in forin loop
console.log(obj);
console.log(JSON.stringify(obj));
for (const key in obj) {
    console.log(key);
};