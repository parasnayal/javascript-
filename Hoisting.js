console.log(" This tutorial is all about the hoisting in javascript ");
// Hoisting is the mechanism in the javascript in which all variable declaration or function declaration are moved to top of the code before code execution

// (1) => var is hoisted

console.log(a); // result => undefined
var a = 10;
console.log(a);
console.log(window === this);
console.log(this.a);
console.log(window.a);

// Let => let is hoisted but in different manner as comparison to var

//console.log(b);  // referenceError => can't be accessed before initialization
let b = 20;
console.log(b);
console.log(window.b);

// const => const is hoisted but in different manner as comparison to var
//console.log(c);  // referenceError => C can not be accessed before initialization
const c = 30;
console.log(c);
console.log(window.c);


// Hoisting in function declaration and function expression
func()
function func(){
    console.log(" Function declaration are hoisted ");
}
// func();

//funcExpression();  // result => functExpression not a function
var funcExpression = function(){
    console.log("Function expression are not hoisted ");
}
console.log(funcExpression);
// funcExpression();