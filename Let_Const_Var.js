console.log(" This tutorial is all about the difference between var , let and const in javascript ");

// var => (1) => functional scope or local scope
// (2) => it can be redeclared and updated into the scope
// (3) => it can be accessed before initialization and it's default value is undefined
// (4) it can be declared without initialization

// console.log(a);  // result => undefined
// var a = 10;

// Let => (1) => block scope
// (2) => It can not be redeclared into the scope but it can be updated into the scope 
// (3) => it can not be accessed before intialization 
// (4) => it can be declared without initialization

// console.log(b);  // referenceError => b can not be accessed before initialization 
// let b = 20;

// const => (1) => block scope
// (2) => it can not be redeclared and updated into the scope 
// (3) => it can not be accessed before initialization
// (4) => it can't be declared without initialization

// console.log(c);  // referenceError => c can not be accessed before initialization 
// const c = 30;