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

// const newCopiedArray = arr1.copyWithin(0,2);
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

// filter () =>The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);
// console.log(result);
// console.log([1, , undefined].filter((x) => x === undefined));

// find () => The find() method returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.Empty slots in sparse arrays behave the same as undefined.

// findIndex() => The findIndex() method returns the index of the first element in an array that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.Empty slots in sparse arrays behave the same as undefined.

// flat() => The flat(depth) method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.The flat() method ignores empty slots if the array being flattened is sparse.returns a shallow copy that contains the same elements as the ones from the original array

const arr7 = [0, 1, 2, [[[3, 4]]]];

// console.log(arr7.flat(3));

// flatMap() => The flatMap() method returns a new array formed by applying a given callback function to each element of the array, and then flattening the result by one level.
const arr8 = [1, 2, [3], [4, 5], 6, []];

const flattened = arr8.flatMap(num => num);
console.log(flattened)

// forEach() => The forEach() method executes a provided function once for each array element and return value is undefined. It is not invoked for empty slots in sparse arrays.forEach() does not mutate the array on which it is called
// includes() => The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.When used on sparse arrays, the includes() method iterates empty slots as if they have the value undefined.

// indexOf() =>The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.You cannot use indexOf() to search for empty slots in sparse arrays.

// keys() => The keys() method returns a new Array Iterator object that contains the keys for each index in the array.When used on sparse arrays, the keys() method iterates empty slots as if they have the value undefined

// Unlike Object.keys(), which only includes keys that actually exist in the array, the keys() iterator doesn't ignore holes representing missing propertie
const key = arr2.keys();
console.log(key.next().value,'key')

const arr4 = [10,20,,30,40];
console.log(...arr4);
const sparseKeys = Object.keys(arr4);
console.log(sparseKeys,'sparseKeys')
for(const keys of arr4.keys()){
    console.log(keys);
}

// pop() => The pop() method removes the last element from an array and returns that element. This method changes the length of the array.The removed element from the array; undefined if the array is empty.The pop() method is a mutating method. It changes the length and the content of array.n case you want the value of this to be the same, but return a new array with the last element removed, you can use arr.slice(0, -1) instead.

const ele = arr2.pop();
// console.log(ele,'ele');
// console.log(arr2.length);

// push() => The push() method adds one or more elements to the end of an array and returns the new length of the array.The push() method is a mutating method. It changes the length and the content of array.In case you want the value of this to be the same, but return a new array with elements appended to the end, you can use arr.concat() instead. 

// reverse() => The reverse() method reverses an array in place and returns the reference to the same array.The reverse() method preserves empty slots
const arr5 = [1,2,3,4,5];
const reverseArray = arr5.reverse();

// console.log(reverseArray,'reverse')
// reverseArray[0] = 100;
// console.log(arr5)
// console.log(arr4.reverse())

// shift() => The shift() method removes the first element from an array and returns that removed element. This method changes the length of the array.he removed element from the array; undefined if the array is empty.In case you want the value of this to be the same, but return a new array with the first element removed, you can use arr.slice(1) instead.


// *************** slice() **********************
// slice() => The slice() method returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified.The slice() method preserves empty slots. If the sliced portion is sparse, the returned array is sparse as well.

const slicedArray = arr1.slice(0,3);
console.log(slicedArray,'slicedArray');


// ********* Sort() *********************
// splice() =>The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.and return value is an array containing the deleted elements.If the deleted portion is sparse, the array returned by splice() is sparse as well
const myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
// const removedElement = myFish.splice(1,3,'shark');
// console.log(myFish)
// console.log(removedElement)

// toString() => The toString() method returns a string representing the specified array and its elements.

const newString = myFish.toString();
// console.log(newString)
// unshift() => The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array.
