console.log(" This tutorial is all about the function in javascript ");
// First class function or first class citizen => if a function can be treated like any other variable then it is called first class function first class citizen. function can be used as a value of any other variable , function can be returned from any other function and function can be passed as argument to a function

// // Anonymous function => a function which does not have name are known as anonymous function.
// // Use => used as an argument to another function.
// const AnonymousFunc = function(){
//     console.log(" This is anonymous function ");
// }
// AnonymousFunc();

// // Immediately invoked function => An immediately invoked function is a way to execute a function immediately , as soon as they are created.
// // use => Avoid polluting the global namespace.

(function(a,b){
    console.log(a+b);
}(10,20));

// // Arrow function => Arrow function is a way to write a function

// // ********** Difference between arrow function and regular function ************

// // (1) => Argument binding => Argument keyword  can't use to access the argument in the arrow function.

// function multiply(){
// console.log(arguments);
// }
// multiply(2,3,4,5);
// const add = () => {
//     // console.log(arguments); 
//     console.log("Result=> referenceError => argument keyword is not defined"); 
// }
// add(10,20,30,40,50);

// // (2) => we can not use arrow function as a constructor
// function Bio (givenName,givenRole){
//     this.name = givenName;
//     this.role = givenRole;
// }
// const paras = new Bio("nayal","developer");
// console.log(paras);

// const BIO = (givenName,givenRole)=>{
//     this.name = givenName;
//     this.role = givenRole
// }

// //const kishor = new BIO ("Joshi","Devops");
// //console.log(kishor); // result => BIO is not a constructor

// // (3) => regular function hoisted at the top
// // arrow function are hoisted where you define

// // (4) => Arrow function don't have their own 'this';
// // (5) => regular function have their own 'this'

var name = "nayal";
// let name = "kisho";
let object = {
    name :"paras",
    role:"Developer",
    getname(){
        console.log(this.name);
    },
    getname2:()=>{
        console.log(this);
        console.log(this.name);
    }
}
console.log(object);
object.getname();
object.getname2();