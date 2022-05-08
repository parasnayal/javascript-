console.log(" This tutorial is all about the operator in javascript ");

// Logical operator
console.log("======> Logical Operator <======");

// (1) => OR (||)
let a = 10;
let b = 20;
let e = 30;
let res1 = a || b;
let res2 = b || a;
console.log(res1); // output => 10
console.log(res2); // output => 20

let c = true;
let d = false;
let res3 = c || d;
console.log(res3); // output => true

let res4 = a || b || c;
console.log(res4); // output => 10


// (2) => AND (&&) OPERATOR
let f = 40;
let g = 50;
let res5 = f && g;
console.log(res5); // output => 50;

let h = 0;
let res6 = h && f;
console.log(res6);

// Precedence of AND && is higher than OR ||

// (3) => NOT (!)

// A double NOT !! is sometimes used for converting a value to boolean type:
console.log(!!"paras");
console.log(!!"");
console.log(+!!"");
console.log(typeof +!!"");
console.log(typeof !!"");

console.log("======> Logicalm Assignment Operator <======");

// (1) => Logical Or Assignment Operator (||=) or (x||(x=y))
// The logical OR assignment operator (||=) accepts two operands and assigns the right operand to the left operand if the left operand is falsy:
let title;
title ||= "Paras";
console.log(title);

// (2)=> Logical AND Assignment Operator (&&=) or (x && (x = y))
// The logical AND assignment operator only assigns y to x if x is truthy:

const Person = {
    name: "Paras",
    age: 23
}
Person.name &&= "Kishor";
console.log(Person);

// Nullish Coalescing Assignment Operator
// The nullish coalescing assignment operator only assigns y to x if x is null or undefined:
const employee = {
    name: "nayal",
    role: "Devops"
};
employee.age ??= 23;
employee.role ??= "Tester"
console.log(employee);

let I = null;
I ??= "Hello! World";
console.log(I);


console.log("======> Nullish Coalescing Operator <======");
// The nullish coalescing operator returns the second value (value2) if the first value (value2) is null or undefined
let j = null;
let k = 23;
let res7 = j ?? k;
console.log(res7);

console.log("======> Exponentiation Operator <======");
let res8 = Math.pow(2, 3);
console.log(res8);
let res9 = Math.pow(3, 4);
console.log(res9);

// Using Exponentiation Operator
let res10 = 2 ** 5;
console.log(res10);
let res11 = 4 ** 3;
console.log(res11);


console.log("======> String concatenation with binary <======");
// The Binary + is the only operator that supports string in such a way
let string1 = "paras";
let string2 = "nayal";
let res12 = string1 + " " + string2;
console.log(res12);
console.log(res12);

let string3 = "1";
let num1 = 2;
let res13 = string3 + num1;
console.log(res13);


let num2 = 6;
let string4 = "2";
let res14 = num2 - string4;
console.log(res14);
console.log(typeof res14);
let res15 = num2 % string4;
let res16 = num2 / string4;
let res17 = num2 * string4;
console.log(res15);
console.log(res16);
console.log(res17);

console.log("======> Numeric conversion, unary + <======");
let num3 = 10;
console.log(+num3);

let boolean = true;
console.log(+boolean);

let string5 = "2";
console.log(+string5);
console.log(-string5);


console.log('======> Increment Operator <======');
// The (postfix) increment operator increments and returns the value before incrementing
let num4 = 10;
let res18 = num4++;
console.log(num4);
console.log(res18);

// The (prefix) increment operator increments and returns the value after incrementing
let res19 = ++num3;
console.log(num3);
console.log(res19);

// The (postfix) decrement operator decrements and returns the value before decrementing
let num5 = 20;
let res20 = num5--;
console.log(num5);
console.log(res20);

// The (prefix) decrement operator decrements and returns the value after decrementing
let num6 = 30;
let res21 = --num6;
console.log(num6);
console.log(res21);

let res22 = (10 + 5, 20 + 5, 30 + 5, 40 + 5);
console.log(res22);

console.log("12" == 12);
console.log("12" === 12);

// An equality check converts values using the numeric conversion (hence "0" becomes 0)
// A number 0, an empty string "", null, undefined, and NaN all become false. Because of that they are called “falsy” values.