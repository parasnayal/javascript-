console.log(" This tutorial is all about the Object in javascript ");

// Object => Unordered collection of key-value pairs and function 
// key-value pairs is called => properties
// function is called => method

// Creating an object by object literal 
let object = {
    name:"paras",
    role:"developer",
    age:23,
    'house no':254,
    bio(){
        return `Hello! I am ${this.name} and my role is ${this.role}`;
    }
}
console.log(object);
console.log(object.age);
console.log(object['house no']);
object.salary = 10000000;
delete object.role
console.log(object.bio());
console.log(object.__proto__);
console.log(object.__proto__.__proto__);

// Creating an object by object constructor
let object2 = new Object();
object2.name = "kishor";
object2.age = 22;
object2.role = "devops";
object2.bio = function(){
    return `Hello! I am ${this.name} and my role is ${this.role}.`
}
console.log(object2);
console.log(object2.age);
console.log(object2.bio());
console.log(object2.__proto__);
console.log(object2.__proto__.__proto__);

// Creating an object by constructor
function Employee (givenName,givenRole,age){
    this.name = givenName;
    this.role = givenRole;
    this.age = age ;
};
const Employee1 = new Employee("Bhuwan","Tester",22);
console.log(Employee1);
console.log(Employee1.constructor);
console.log(Employee1.__proto__);
console.log(Employee1.__proto__.__proto__);
console.log(Employee1.__proto__.__proto__.__proto__);