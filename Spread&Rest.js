console.log(" This tutorial is all about the spread and rest operator in javascript ");
// ********* REST PARAMETER AND SPREAD OPERATOR ********
// In an array rest operator conedensed multiple elements into an array 
function sum (a,b,...rest){
    // console.log(arguments);
    console.log(rest);
    console.log(a+b);
}
sum(10,20,30,40,50,60);

// spread operator spread the element of the array
let array = [2,3,4,5,6];
function spread (a,b,c,d,e){
console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log(e);
}
// spread(array[0],array[1],array[2],array[3],array[4]);
spread(...array)

let object = {
    name:"paras",
    role:"developer",
    age:23,
}
let {name,...rest} = object;
console.log(object);
console.log(name);
console.log(rest);
 let object2 = {
     ...object,
     name:"nayal"
 }
 console.log(object2);