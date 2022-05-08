console.log("This tutorial is all about the reduce method in javascript ");
// Reduce method reduce an array to a single value and it run a function for every array elements . The value returned by the function is stored in an accumulator and used as a initial value.

let array = [10,20,30,40,50];
let InitialValue = 0 ;

for(let index = 0 ; index<array.length ; index++ ){
    const element = array[index];
    InitialValue+=element;
}
console.log(InitialValue);

// Using reduce method

// const reducer = (accumulator,curValue) =>{
//     return accumulator+curValue;
// }
// const result = array.reduce(reducer,InitialValue);
// console.log(result);

const reducer = (accumulator,curValue) => {
    console.log("Accumulator is => ",accumulator);
    console.log("current Value is => ",curValue);
    return accumulator+curValue
}
const result2 = array.reduce(reducer,InitialValue);