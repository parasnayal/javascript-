console.log(" This tutorial is all about the destructuring in javascript ");
// Destructuring is the way to extract a value from array and properties from an object then assign them to a variable

//  ***** Array destructuring ******
let array = [10,20,30,40,50];
let [a,b] = array;
console.log(a);
console.log(b);

// ****** Object destructuring *******
let object = {
    name :"paras",
    age:23,
    role:"developer"
};
let {name,age} = object;
console.log(name);
console.log(age);
