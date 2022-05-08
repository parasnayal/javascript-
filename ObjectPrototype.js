console.log(" This tutorial is all about the prototype , prototype inheritance and prototype chain in javascript ");
// Prototype => prototype is an object that is associates with every function and object by default in javascript .

// prototype chain => as we know everything in javascript is an object . prototype object have own it's prototype and until prototype object is not equal to null then it is called prototype chain 

let object = {
    name:"paras",
    role:"developer",
    age:23,
    bio(){
        return `Hello! I am ${this.name} and my role is ${this.role}`;
    }
};

console.log(object);
console.log(object.__proto__);
console.log(typeof object.__proto__);
console.log(object.__proto__.__proto__);

let string = "Hello! World";
console.log(string);
console.log(string.__proto__);
console.log(string.__proto__.__proto__);
console.log(string.__proto__.__proto__.__proto__);

// **********  PROTOTYPE INHERITANCE IN JAVASCRIPT  ************
// it is an method by which an object can inherit the properties and methods from another object.

function Employee (givenName,givenRole,salary){
    this.name = givenName;
    this.role = givenRole;
    this.salary = salary;
}
Employee.prototype.bio = function(){
    return`Hello! I am ${this.name} and my role is ${this.role}`;
}
const Employee1 = new Employee("paras","developer",100000000);
console.log(Employee1);
console.log(Employee1.bio());
// console.log(Employee1.__proto__);
// console.log(Employee1.__proto__.__proto__);
// console.log(Employee1.__proto__.__proto__.__proto__);

function programmer (givenName,givenRole,salary,language) {
    Employee.call(this,givenName,givenRole,salary);
    this.language = language;
}
programmer.prototype = Object.create(Employee.prototype);
programmer.prototype.constructor = programmer
const Employee2 = new programmer("nayal","Reactjs Developer",20000000000,"javascript");
console.log(Employee2);
console.log(Employee2.bio());
console.log(Employee2.__proto__);
console.log(Employee2.__proto__.__proto__);
console.log(Employee2.__proto__.__proto__.__proto__);
console.log(Employee2.__proto__.__proto__.__proto__.__proto__);