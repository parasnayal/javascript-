console.log(" This tutorial is all about the block and variable shadowing in javascript ");

// Shadowing => When a variable declared in a certain scope having the same name defined on its outer scope and when we call the variable from the inner scope , the value assigned to the variable in the inner scope is the value that will be stored in the variable in the memory space.This is known as shadowing or variable shadowing.

var a = 100;
let b = 200;
const c = 300;

{

    var a = 10;
    let b = 20;
    const c = 30;
    console.log(a);
    console.log(b);
    console.log(c);
}
console.log(a);
console.log(b);
console.log(c);