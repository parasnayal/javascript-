console.log(" This tutorial is all about the map method in javascript ");
// map methods creates a new array from calling function for every array element. map does not change the actual array
let array = [10,20,30,40,50,60];

// let res = [] ;
// for(let index = 0 ; index<array.length ; index++){
//     const element = array[index];
//     res.push(element+5);
// }
// console.log(res);

const result = array.map(item=>item+5);
console.log(result);