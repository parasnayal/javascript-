console.log(" This tutorial is all about the Scope , Scope Chain and Lexical Scope in javascript ");

// Scope => Scope refers to the current context or space of code , which determines the accessbility of variable , function and object etc.

// Global Scope => All the variable declared outside the function are known as global variable and have a global scope .

var a = 10;
let b = 20;
const c = 30;

console.log('a => ', a);
console.log('b => ', b);
console.log('c => ', c);

// function scope or local scope => All the variable declared inside the function are known as local variable and have a local scope or function scope.

function local() {
    var d = 40;
    let e = 50;
    const f = 60;

    console.log('d => ', d);
    console.log('e => ', e);
    console.log('f => ', f);
}

local();

// Block Scope => All the variable declared inside the curly braces are known as block variable and have a block scope.

if (true) {
    var g = 70;
    let h = 80;
    const i = 90;

    console.log('g => ', g);
    console.log('h => ', h);
    console.log('i => ', i);
}
console.log('g => ', g);

// Scope chain => When we want to find a variable during the function call , then control first goes to the current context or local memory , if variable is not found here then control goes to outer scope or parent's scope if the variable is not found here then control goes to parent's scope until it reaches to the global scope.This way of finding a variable are known as scope chaining or scope chain.

function scopeChain() {
    // const j = 10000;
    function scopeChain2() {
        console.log(j);
    }
    scopeChain2();
}
var j = 100;
scopeChain()

// Lexical scope => local memory + reference to the parent's 