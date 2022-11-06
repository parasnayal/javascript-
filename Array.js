console.log("This tutorial is all about the array in javascript")


const arr1 = ["10",20,30,"paras",{language:"javascript",role:"developer"}];
const arr2 = ["kishor","naresh","vishal"];

// length => return the number of elements in the array
console.log(arr1);
// console.log(arr1.length);

// at() => The at() method takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.Returns undefined if the given index can not be found.
const num1 = arr1.at(0);
const num2 = arr1.at(-1);
// console.log(num1);
// console.log(num2);

// concat() => The concat() method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.concat returns a shallow copy of the existing array on which it is called.The concat() method preserves empty slots if any of the source arrays is sparse.

const arr3 = arr1.concat(arr2);
// console.log(arr3);

//  copyWithin(target, start, end) => The copyWithin() method shallow copies part of an array to another location in the same array and returns it without modifying its length. It returns the modified array.The copyWithin() method is a mutating method.The copyWithin() method preserves empty slots. Although strings are also array-like, this method is not suitable to be applied on them, as strings are immutable.

// target: The index position to copy the elements to(Required).
// start: It is optional. The index position to start copying elements from (default is 0).
// end: It is optional. The index position to stop copying elements from (default is array.length).

const newCopiedArray = arr1.copyWithin(0,2);
// console.log(newCopiedArray,'newCopiedArray');
// newCopiedArray[4].language = "c++";

// entries() => The entries() method returns a new Array Iterator object that contains the key/value pairs for each index in the array.

const iteratorObject = arr1.entries();
// console.log(iteratorObject.next().value);
// console.log(iteratorObject.next().value);

// every() => The every() method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.It is not invoked for empty slots in sparse arrays. 

// fill() => The fill(value, start, end) method changes all elements in an array to a static value, from a start index (default 0) to an end index (default array.length). It returns the modified array.

// arr1.fill(0,2,4);
// console.log(arr1);

// filter () =>