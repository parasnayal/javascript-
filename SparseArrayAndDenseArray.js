console.log("This tutorial is all about the sparse and dense array in javascript");
// In javascript , array is a Hashtable object type so the interpreter does not need to keep track of physical memory and changing the value of an element does not affect other elements as they are not stored in contigous block of memory.javascript array indexes are  32-bit unsigned integer(2^32-1).

// If you want to use javascript arrays as contigous block of memory then you should look into using TypedArray.


// Changing a primitive that was assigned to an array will not change the value in the array as they're stored by value. Objects on the other hand are stored by reference, so changing the objects value will reflect that change in that array.

const arr = [];
const obj = { name: "paras" };
let isBool = true;
arr.push(obj);
arr[1] = isBool;
// console.log(arr, 'Before changes');
// console.log(arr[0], 'Before changes');
// console.log(arr[1], 'Before changes');
obj.age = 23;
isBool = false;
// console.log(arr, 'after changes');
// console.log(arr[0], 'after changes');
// console.log(arr[1], 'after changes');


// technically array-indexes are strings.They are actually hash tables internally, so you can use not only large integers but also strings, floats, or other objects. All keys get converted to strings via toString() before being added to the hash.
const arr2 = [10,20,30];
// console.log(arr2[0]);
// console.log(arr2['0']);

// Arrays under the hood in JavaScript are Objects. Their keys are numbers, and their values are the elements.
// Dense array => A dense array is an array where the elements are all sequential starting at index 0.the length property of an array accurately specifies the number of elements in the array.
const array3 = ["paras","nayal","kishor","naresh","vishal","neeraj"];
// console.log(array3)
// console.log(array3.length)

// Sparse array => A sparse array is one in which the elements are not sequential, and they don't always start at 0.

let array4 = [];
array4[10] = 20;  // creates a hole and also known as holey array
// console.log(array4);

// delete operator can also creates a holes in the array;
const array5 = [100,200,300,400];
console.log(array5.length);
console.log(array5)
delete array5[0];
// console.log(array5)
// console.log(array5.length);

// (1) Array.prototype.forEach skips the holes 
// (2) Array.prototype.map behaves in a slightly different way, such as the callback is not operated for the holes but they are preserved and available in the new array.
// (3) Array.prototype.filter method preserves the elements on which the callback returns truthy, the holes are evaluated to be falsy (as they are not defined) and removed from the produced array.
// (4) Array.prototype.reduce does not execute the callback function either where the accumulation is not achieved at the specific indexes.
// Spread operator and from() method treats the holes as undefined

const holeyNewArray = [1,2,,,3].map(function(value, index){
    // console.log('At ' + index + ' =>',value)
    return value * 2
})
// console.log(holeyNewArray)
