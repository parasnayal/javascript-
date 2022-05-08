console.log(" This tutorial is all about the call by value in javascript ");
// 1st example
let a = 10;
let b;
b = a;
a=20;
console.log(a);
console.log(b);

// 2nd example
function multiply(x){
    x= x*x;
    return x;
}
let y = 20;
let result = multiply(y);
console.log(result);
console.log(y);