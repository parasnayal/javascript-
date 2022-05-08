console.log(" This tutorial is all about the object properties in javascript ");

// Property Descriptor => Every object property is more than just key and value pair.Each property is having property descriptor that helps to see all the attributes of that property.


// Object have two types of properties :
// (1) => data properties
// (2) => accessor properties

// (1) => DATA properties
// (a) => value => value of the object property
// (b) => writable => if true, the value can be changed, otherwise it’s read-only.
// (c) => enumerable => if true, then listed in loops(for..in), otherwise not listed.
// (d) => configurable => if true, the property can be deleted and these attributes can be modified, otherwise not.

const person = {
    firstName:"paras",
    lastName:"nayal",
    age:23,
    address:{
        state:"Uttrakhand",
        city:"Tanakpur"
    }
}

let descriptor1 = Object.getOwnPropertyDescriptor(person,"address");
let descriptor2 = Object.getOwnPropertyDescriptors(person);
// console.log(descriptor1);
// console.log(descriptor2);

// (a) => writable
Object.defineProperty(person,"age",{
    writable:false
})
person.age =25;
// console.log(person);


// (b) => configurable
Object.defineProperty(person,"firstName",{
    configurable:false
})
delete person.firstName;
// console.log(person);

// (c) => enumerable
Object.defineProperty(person,"lastName",{
    enumerable:false
})
for (const key in person) {
    if (Object.hasOwnProperty.call(person, key)) {
        const element = person[key];
        // console.log(element);
    }
}


// ACCESSOR PROPERTIES=> Accessor properties are represented by “getter” and “setter” methods. In an object literal they are denoted by get and set:

const employee = {
    firstName:"Kishor",
    lastName:"Joshi",
    get fullName(){return `Hello! I am ${this.firstName} ${this.lastName}`},
    set fullName(value){
        [this.firstName,this.lastName] = value.split(" ");
    }
}
employee.fullName = "Bhuwan bhatt";
console.log(employee.firstName);
console.log(employee.lastName);
console.log(employee.fullName);

// we read it normally: the getter runs behind the scenes.