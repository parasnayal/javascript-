console.log(" This tutorial is all about the object equality in javascript ");
// JavaScript provides us with a number of ways to check if two objects are equal.There are three types of equality – 
// Referential equality.
// Shallow equality.
// Deep equality.

// Referential equality: We can say two objects are referentially equal when the pointers of the two objects are the same or when the operators are the same object instance.
// (a) ===
// (b) == 
// (c) Object.is()

let a = 10;
let b = 10;
let c = "10";
// console.log(a==b);
// console.log(a==c);
// console.log(a===c);
// console.log(a===b);

const name1 ={
    name:"paras"
}
const name2 ={
    name:"paras"
}
console.log(name1==name2);
console.log(name1===name2);
console.log(name1===name1);
console.log(Object.is(a,b));
console.log(Object.is(name1,name1));
console.log(Object.is(name1,name2));
