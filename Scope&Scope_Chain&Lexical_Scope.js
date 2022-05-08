console.log(" This tutorial is all about the Scope , Scope Chain and Lexical Scope in javascript ");

// Scope => Scope refers to the current context or space of code , which determines the accessbility of variable , function or object etc.

// Global Scope => all the variable declared outside the function are known as global variable and have global scope.

// var a = 10;
// let b = 20;
// let c = 30;
// console.log(a);
// console.log(b);
// console.log(c);

// function scope or local scope => All the variable declared inside the function are known as local variable and have a function scope or local scope

// function Local(){
//     var d = 40;
//     let e = 50;
//     const f = 60;
//     console.log(d);
//     console.log(e);
//     console.log(f);
// }
// Local();

// Block Scope => Variable declared inside the Curly braces {} are known as block variable and have a block scope 
// {
//     var g = 70;
//     let h = 80;
//     const i = 90;
//     console.log(g);
//     console.log(h);
//     console.log(i);
// }
// console.log(g);
// console.log(h);
// console.log(i);

// Scope Chain => when we want to find a variable during the function call , then control first checks the variable into the local memory or current context , if variable is not found here then control goes to outer scope or parent's scope , if variable also not available here then again control goes to parent's scope until it reaches to the global scope .this way of finding a variable are known as scope chaining or scope chain 

function scopeChain(){
    function scopeChain2(){
        console.log(j);
    }
    scopeChain2();
} 
var j = 100;
scopeChain()

// Lexical scope => local memory + reference to the parent's scope