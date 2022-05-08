console.log(" This tutorial is all about the array and it's method in javascript ");

const array = ["Paras","Nayal","Kishor","Joshi","Vishal",10,20,30,20];
// const array = ["Paras","Nayal","Kishor","Joshi","Vishal",10,20,30,[[[70,80,90]]]];

const res1 = array.length;
console.log(res1);

// Removes the last element from an array and returns it. If the array is empty, undefined is returned and the array is not modified.
// const res2 = array.pop();
// console.log(res2);

// Appends new elements to the end of an array, and returns the new length of the array.
// const res3 = array.push("Naresh");
// console.log(res3);

// Removes the first element from an array and returns it. If the array is empty, undefined is returned and the array is not modified.
// const res4 = array.shift();
// console.log(res4);

// Inserts new elements at the start of an array, and returns the new length of the array.
// const res5 = array.unshift("Bhuwan")
// console.log(res5);

// Returns a copy of a section of an array. It returns a shallow copy of elements from the original array.
// const res6 = array.slice(1,5);
// let res7 = array.slice(0);
// res7[8].unshift(200000);
// res7.unshift(200000);
// console.log(res7);
// console.log(res6);

// Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
// const res8 = array.splice(0,3,"Bhuwan");
// const res8 = array.splice(-2,2);
// console.log(res8);

// The concat() method is used to merge two or more arrays and returns a new array.
// const res9 = array.concat(["apple","Banana","Grapes"]);
// const res9 = array.concat();
// res9[8].unshift(8495469)
// console.log(res9);

// The findIndex() method returns the index of the first element in the array that satisfies the provided testing function.
// const res10 = array.findIndex(item => item === "Kishor");
// console.log(res10);

// The find() method returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.
// const res11 = array.find(item => item > 20);
// console.log(res11);

// The join() method creates and returns a new string by concatenating all of the elements in an array (or an array-like object), separated by commas or a specified separator string
// const res12 = array.join(",");
// console.log(res12);

// The entries() method returns a new Array Iterator object that contains the key/value pairs for each index in the array.
// const res13 = array.entries();
// console.log(res13)
// console.log(res13.next().value)
// for(let [key,value] of res13){
//     console.log("Key is => ",key);
//     console.log("value is => ",value);
// }

// The keys() method returns a new Array Iterator object that contains the keys for each index in the array.
// const res14 = array.keys();
// console.log(res14);
// console.log(res14.next().value);
// console.log(res14.next().value);
// for(let key of res14){
//     console.log("Key is => ",key);
// }

// The values() method returns a new array iterator object that contains the values for each index in the array
// const res15 = array.values();
// console.log(res15);
// console.log(res15.next().value);
// console.log(res15.next().value);
// console.log(res15.next().value);

// The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.
// const res16 = array.includes("Paras");
// console.log(res16);

// The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth
// const res17 = array.flat(3);
// console.log(res17);

// The Array.isArray() method determines whether the passed value is an Array.
// const res18 = Array.isArray(array);
// console.log(res18);

// Returns the index of the first occurrence of a value in an array
// const res19 = array.indexOf(30);
// console.log(res19);

// const res20 = array.lastIndexOf(20);
// console.log(res20);

// Returns a new array from a set of elements.
// const res21 = Array.of(2,5,6,8,2);
// console.log(res21);

// Returns a string representation of an array.
// const res22 = array.toString();
// console.log(res22);

// const string = "Hello! World";
// const array2 = [10,20,30]
// const res23 = Array.from(string);
// console.log(Array.from(array2,item=>item+5));
// console.log(array2);
// console.log(res23);

console.log(array);