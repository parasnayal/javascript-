console.log(" This tutorial is all about the for in loop in javascript ");
// The for...in statement iterates over all enumerable properties of an object that are keyed by strings (ignoring ones keyed by Symbols), including inherited enumerable properties.It also goes up to the prototype chain and enumerates over inherited properties.
// for...in is built for iterating object properties
const person = {
    firstName:"paras",
    lastName:"nayal",
    age:23
}
console.log(person);
for(const element in person){
    console.log(person[element]);
}
const employee = {
    name:"Bhuwan bhatt",
    age:"22",
    role:"Tester"
};
const newEmployee = Object.create(employee);
newEmployee.salary = 200000000;
newEmployee.address = "Uttrakhand";
// for(const element in newEmployee){
//     console.log(element);
// }
for(const element in newEmployee){
    if(newEmployee.hasOwnProperty(element)){
        console.log(element);
    }
}