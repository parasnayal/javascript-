console.log(" This tutorial is all about the shallow and deep comparison in javascript ");
const person = {
    firstName:"paras",
    lastName:"nayal",
    age:23,
    address:{
        state:"Uttrakhand",
        city:"Tanakpur"
    }
}
const coppiedPerson = person; // create shallow copy
console.log(person);
console.log(coppiedPerson);
coppiedPerson.age = 200;
coppiedPerson.address.city = "Haldwani";
console.log(person == coppiedPerson);  
console.log(person === coppiedPerson); // true,same reference

const a = {name:"paras",age:23};
const b = {name:"paras",age:23};
console.log(a==b); // false,different reference but keys are same
console.log(a===b);