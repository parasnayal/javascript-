console.log(" This tutorial is all about the Operator in javascript ");

// The in operator is an inbuilt operator in JavaScript which is used to check whether a particular property exists in an object or not. It returns boolean value true if the specified property is in an object, otherwise it returns false.

const array = ["Mango","Grapes","Banana","Guava","Pineapple"]
console.log(array);
console.log(0 in array);
console.log(1 in array);
console.log(2 in array);
console.log(8 in array);
console.log('concat' in array);

const object = {
    firstName:"paras",
    lastName:"nayal",
    age:23
};
console.log(object);
console.log('firstName' in object);
console.log('lastName' in object);
console.log('address' in object);
console.log('hasOwnProperty' in object);
