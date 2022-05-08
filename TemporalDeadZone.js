console.log(" This tutorial is all about the temporal dead zone in javascript ");

// As we know let and const are not accessible before the initializattion . let and const are hoisted unlike var. then the phase between the let and const are hoisted and variable declared with let and const are initialised with a value is known as temporal dead zone.
console.log(b);
let a = 200;
var b = 400;

// ReferenceError => represents an error when a variable that doesn't exist(hasn't yet been initialised) in the current scope is referenced.
// TypeError => represents an error when an operation could not be performed, typically when when a value is not of the expected type 