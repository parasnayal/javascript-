console.log(" This tutorial is all about the call , apply and bind method in javascript ");

// The call method allows us to use a function belonging to a object to be assigned and called for another object.

let object1 = {
    name:"paras",
    role:"developer",
    bio(){
        return `Hello! I am ${this.name} and my role is ${this.role}`;
    }
}
console.log(object1);
console.log(object1.bio());

let object2 = {
    name:"nayal",
    role:"Reactjs developer",
    Age:23
}
console.log(object2);
console.log(object1.bio.call(object2));

const address = function(state,language){
    return `Hello! i am ${this.name} and i live in ${state}.my favourite language is ${language}`
}

let result1 = address.call(object1,"Uttarakhand","javascript");
console.log(result1);

let result2 = address.apply(object2,["Haryana","c"]);
console.log(result2);

// ********* BIND METHOD ***********
// Bind method does not call a function or method directly instead of that it creates a copy of the function and then you can store copy of that function in a variable and call that variable where you want to use

let object3 = {
    name:"bhuwan",
    role:"tester"
}
let result3 = address.bind(object3,"haldwani","java");
// console.log(result3);
console.log(result3());

// let result4 = address.bind(object3,"khtima","Hindi");
// console.log(result4());