console.log(" This tutorial is all about the difference between var , let and const in javascript ");

// *************** var **************

// (1) => var declarations are globally scoped or function scoped
// (2) => it can be redeclared and updated in to the scope.
// (3) => it can be accessed before initialization and it's default value is undefined.
// (4) => it can be declared without initialization.

// console.log(a);  // result => undefined
// var a = 10;

var a = 10;

function scope (){
    console.log(a)
    a = 20;
    console.log(a)
}
scope();

console.log(a)

// *************** let **************

// (1) => block scope
// (2) => it can't be redeclared in to the scope but it can updated in the scope.
// (3) => it can't be accessed before initialization.
// (4) => it can be declared without initialization.

// console.log(b);  // referenceError => b can not be accessed before initialization 
// let b = 20;

let b = 30;

function scopeLet (){
    console.log(b)  // ReferenceError: Cannot access 'b' before initialization
    b = 40;
    let b = 50;
    console.log(b)
}
scopeLet();

console.log(b)

// *************** const **************

// (1) => block scope
// (2) => it can't be redeclared and updated in the scope.
// (3) => it can't be accessed before initialization.
// (4) => it can't be declared without initialization.

// console.log(c);  // referenceError => c can not be accessed before initialization 
// const c = 30;