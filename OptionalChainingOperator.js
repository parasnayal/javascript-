console.log(" This tutorial is all about the optional chaining operator in javascript ");

// The optional chaining operator (?.) returns undefined instead of throwing an error if you attempt to access a property of an null or undefined object: obj ?. property.


// obj?.prop
// obj?.[expr]
// arr?.[index]
// func?.(args)
let person = {
    firstName:"paras",
    lastName:"nayal",
    address:{
        State:"Uttrakhand",
        city:"Champawat"
    },
    about:{
        role:"Reactjs Developer",
        experience:"Fresher",
        salary:20000000,
        Id:24
    }
}
let value = person.firstName && person.lastName;
// console.log(value);

let result = person.address ?. State
// console.log(result);

console.log(person.about ?. role);
console.log(person.pet ?. name);
// console.log(person.pet.name);


// optional chaining with the function call
let user1 = () => console.log("Hello! World");
let user2 = {
    firstName:"Kishor",
    lastName:"joshi",
    address:{
        city:"Haldwani"
    },
    bio(){console.log(`Hello! I am ${this.firstName} ${this.lastName}`);}
}
let user3 = {};
user1 ?. ();
user2.bio ?. ();
// user3.bio();
console.log(user3.bio ?. ());