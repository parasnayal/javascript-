console.log("This tutorial is all about the Array-like object in javascrit")
// An array-like is an object.Array-like is completely different from a normal array. It is not constructed by Array or with an Array literal [].The length property will not automatically update as well. You can not shrink the array-like by reducing the length property value you do with arrays.
// The index range of an array-like object is 0≤I≤2^53–1, whereas the index range of an array is 0≤ I <2^32–

// Example => (1) JavaScript HTMLCollection is an Array-like object.
// (2) => In javascript normal function's arguments is an Array-like object.
// (3) => the string was introduced as an array-like object in which every character is accessible using its numerical index

// Has indexed access to the elements and a non-negative length property to know the number of elements in it. These are the only similarities it has with an array.
// Doesn't have any of the Array methods like push, pop, join, map, etc.

const array_like = {0:"paras",1:"nayal",2:"javascript",length:3};
console.log(array_like[0]) 
console.log(array_like.length)

function sum(){
    console.log(arguments)
}
sum(10,20,30);

const stringObj = "parasnayal";
const str = Array.prototype.join.call(stringObj,"*");
// console.log(str);

// Ways to convert array-like to arrays
// (1) => Array.from()
// (2) => Spread operator
// (3) => Object.values()
