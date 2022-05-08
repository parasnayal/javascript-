console.log(" This tutorial is all about the javascript output question in javascript ");

// (1) 
// (function () {
//     // b = 3;
//     // var a = b;
//     var a = b = 3;
// })();
// console.log("a defined? " + (typeof a !== 'undefined')); // false
// console.log("b defined? " + (typeof b !== 'undefined')); // true


// (2)
// var myObject = {
//     foo: "bar",
//     func: function() {
//         var self = this;
//         console.log("outer func:  this.foo = " + this.foo); // bar
//         console.log("outer func:  self.foo = " + self.foo); // bar 
//         (function() {
//             console.log("inner func:  this.foo = " + this.foo); // undefined => because in iife this refers to window object
//             console.log("inner func:  self.foo = " + self.foo); // bar 
//         }());
//     }
// };
// myObject.func();


// (3)
// function foo1()
// {
//   return {
//       bar: "hello"
//   };
// }

// function foo2()
// {
//   return
//   {
//       bar: "hello"
//   };
// }
// console.log(foo1()); // {bar:"hello"}
// console.log(foo2()); // undefined

// (4)
// (function() {
//     console.log(1);  // 1st log
//     setTimeout(function(){console.log(2)}, 1000); // 4th log
//     setTimeout(function(){console.log(3)}, 0); // 3rd log 
//     console.log(4); // 2nd log
// })();

// (5)
// var arr1 = "john".split(''); // j o h n 
// var arr2 = arr1.reverse(); //   n h o j
// var arr3 = "jones".split(''); // j o n e s
// arr2.push(arr3); // n h o j j o n e s
// console.log("array 1: length=" + arr1.length + " last=" + arr1.slice(-1)); // 5 j o n e s
// console.log("array 2: length=" + arr2.length + " last=" + arr2.slice(-1)); // 5 j o n e s

// (6)
// console.log(1 +  "2" + "2"); // 122 => string form 
// console.log(1 +  +"2" + "2"); // 32 => string form
// console.log(1 +  -"1" + "2"); // 02 => string form
// console.log(+"1" +  "1" + "2"); // 112 => string form
// console.log( "A" - "B" + "2"); // NaN2 => string form
// console.log( "A" - "B" + 2); // NaN => number form

// (7)
// console.log("0 || 1 = "+(0 || 1)); // 1
// console.log("1 || 2 = "+(1 || 2)); // 1
// console.log("0 && 1 = "+(0 && 1)); // 0
// console.log("1 && 2 = "+(1 && 2)); // 2

// (8)
// console.log(false == '0') // true
// console.log(false === '0') // false

// var a = {},
//     b = { key: 'b' },
//     c = { key: 'c' };

// When setting an object property, JavaScript will implicitly stringify the parameter value.since b and c are both objects, they will both be converted to "[object Object]" Therefore, setting or referencing a[c] is precisely the same as setting or referencing a[b].
// a[b] = 123;
// a[c] = 456;

// (function (x) {
//     return (function (y) {
//         console.log(x); // 1
//     })(2)
// })(1); 

// console.log(a[b]);

// var hero = {
//     _name: 'John Doe',
//     getSecretIdentity: function (){
//         return this._name;
//     }
// };
// // var stoleSecretIdentity = hero.getSecretIdentity;
// var stoleSecretIdentity = hero.getSecretIdentity.bind(hero);
// console.log(stoleSecretIdentity()); // john doe
// console.log(hero.getSecretIdentity()); // john doe

// var length = 10;
// function fn() {
//     console.log(this.length); // 10
// }

// var obj = {
//     length: 5,
//     method: function (fn) {
//         console.log(arguments);
//         // console.log(typeof arguments);
//         // console.log(arguments[0]);
//         // console.log(typeof arguments[0]);
//         // console.log(arguments.length);
//         fn();
//         arguments[0]();
//     }
// };

// obj.method(fn, 1);

// (function () {

//     try {
//         throw new Error();
//     } catch (x) {
//         var x = 1, y = 2;
//         console.log(x); // 1
//     }
//     console.log(x); // 1
//     console.log(y); // 2
// })();

// var x = 21;
// var girl = function () {
//     console.log(x); // undefined
//     var x = 20;
// };
// girl ();

// for (let i = 0; i < 5; i++) {
//     setTimeout(function() { console.log(i); }, i * 1000 );
//   }
// 0 , 1 , 2 , 3, 4

// console.log(1 < 2 < 3); // true
// console.log(3 > 2 > 1); // false because of operator associativity

// for (var i = 0; i < 5; i++) {
// 	setTimeout(function() { console.log(i); }, i * 1000 );
// }

var b = 1;
function outer(){
   	var b = 2
    function inner(){
        b++;
        var b = 3;
        console.log(b) // 3
        // due to hoisting
        // var b; // b is undefined
        // b++; // b is NaN
        // b = 3; // b is 3
    }
    inner();
}
outer();