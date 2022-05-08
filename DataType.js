console.log(" This tutorial is all about the data type in javascript ");
// Data type => Data type tells that what kind of data is being stored in variable

// Primitive data type => it stored in stack. All primitive data types are immutable.The variable may be reassigned a new value , but the existing value can't be changed in the ways that objects , array and functions can be altered  
// (1) => Number
// (2) => String
// (3) => Boolean
// (4) => Symbol
// (5) => Null
// (6) => Undefined

// JavaScript’s Primitive Wrapper Objects
// we know primitive data type means it is not an object and does not have methods
let str = "paras";
console.log(str.toUpperCase());
console.log(str.custom = "nayal");
console.log(str.constructor === String);
console.log(str.custom);
// a temporary object wrapper was created when you tried to set the custom property to str, and the result is 1, after that the temporary object wrapper is removed and the custom property doesn’t exist anymore.
// Except for null and undefined, all primitive values have object equivalents that wrap around the primitive values.

123    // one-hundred twenty-three
123.0  // same
123 === 123.0  // true

Number('123')  // returns the number 123
Number('123') === 123  // true

Number("unicorn")  // NaN
Number(undefined)  // NaN

// Reference data type => It stored in heap
// (1) => array
// (2) => Object
// (3) => Dates