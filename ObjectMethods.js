console.log(" This tutoial is all about the object's methods ");
// (1)=> Object.assign () => coppied all the enumerable and own properties from source object to target object.and it returns the target object .
const person = {
    firstName:"paras",
    lastName:"nayal",
    age:23,
    address:{
        state:"Uttrakhand",
        city:"Champawat"
    }
};
console.log(person);

// Object.defineProperty(person,'firstName',{
//     enumerable:false
// })

const coppiedPerson = Object.assign({},person);
console.log(coppiedPerson);

// (2) => Object.create() method creates a new object, using an existing object as the prototype of the newly created object.
// Object.create() is used for implementing inheritance.
// let  obj = Object.create(null);
// let  obj = Object.create(person);
// console.log(obj);

// (3) => Object.getOwnPropertyDescriptor();

// (4) => Object.getOwnPropertyDescriptors();

// (5) => Object.defineProperties();

// (6) => Object.defineProperty();

// Object.entries() => Returns an array of key/values of the enumerable properties of an object

console.log(Object.entries(person));

for(const [key,value] of Object.entries(person)){
    console.log(`key is => ${key}`);
    console.log(`value is => ${value}`);
}

// conver object to a map
// const map = new Map(Object.entries(person));
// console.log(map);

//  =======> Object.isFrozen()=>Returns true if existing property attributes and values cannot be modified in an object, and new properties cannot be added to the object.
// freeze is shallow

// console.log(Object.isFrozen(person));

let obj = Object.freeze(person)
console.log(obj === person);
person.age = 32;

person.address.city = "Haldwani";

// The result of calling Object.freeze(object) only applies to the immediate properties of object itself.If the value of those properties are objects themselves, those objects are not frozen.use deepfreeze

console.log(person);

// =========> Object.fromEntries()=> transforms a list of key-value pairs into an object.
const array =[ ["paras","nayal"],["a",20],["b",40],["kishor","bhuwan"]]
const obj1 = Object.fromEntries(array);
console.log(obj1);

// Object.is=>Returns true if the values are the same value, false otherwise.
console.log(Object.is(25,25)); // true
console.log(Object.is(25,'25')); // false
console.log(Object.is(null,null)); // true
console.log(Object.is({name:"paras"},{name:"paras"})); // false
const obj2 = {name:"rohan"}
const obj3 = obj2;
console.log(Object.is(obj2,obj3));  // true

// ======> Object.keys()=> Returns the names of the enumerable string properties and methods of an object.
console.log(Object.keys(person));

console.log(Object.values(person));