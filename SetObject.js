console.log(" This tutorial is all about the set object in javascript ");
// (1) => The set object allows you to store unique value of any data types.
// (2) => You can iterate through elements of the set in an insertion order.

let set = new Set();
console.log(set);

// add element in set object
set.add(1);
set.add("Hello! World");
set.add("Hello! World");
set.add("Hello! ");
set.add(function(){});
set.add({});
console.log(set.size);

console.log(set.has(1));

// ******* ITERATION ******
for(let item of set){
    console.log(`Item is => ${item}`);
}

// // Weakset=> can store only object 
// // not iterable 
// // let mySet = new WeakSet([10,20]);
// let mySet = new WeakSet([{name:"paras"}]);
// console.log(mySet);
