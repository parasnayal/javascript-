console.log(" This tutorial is all about the call by reference in javascript ");
const person = {
    firstName:"paras",
    lastName:"nayal",
    age:23
};
console.log(person);
function increaseAge(obj){
    obj.age += 1;
    console.log(obj);

    obj = {firstName:"kishor",lastName:"joshi",age:22};
    console.log(obj);
};
increaseAge(person);
console.log(person);