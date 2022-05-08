console.log("This tutorial is all about the classes in javascript ");
// Classes are template for creating objects
class Employee {
    constructor(givenName, givenRole, salary) {
        this.name = givenName;
        this.role = givenRole;
        this.salary = salary;
    }
    slogan() {
        return `Hello! I am ${this.name} and my role is ${this.role}`;
    }
}
const Employee1 = new Employee("paras", "developer", 10000000);
console.log(Employee1);
console.log(Employee1.slogan());

// console.log(Employee1.__proto__);
// console.log(Employee1.__proto__.__proto__);
// console.log(Employee1.__proto__.__proto__.__proto__);

class programmer extends Employee {
    constructor(givenName, givenRole, salary, language) {
        super(givenName, givenRole, salary);
        this.language = language;
    }
}
const Employee2 = new programmer ("nayal","Reactjs developer",400000000,"javascript");
console.log(Employee2);
console.log(Employee2.slogan());
console.log(Employee2.__proto__);
console.log(Employee2.__proto__.__proto__);
console.log(Employee2.__proto__.__proto__.__proto__);
console.log(Employee2.__proto__.__proto__.__proto__.__proto__);