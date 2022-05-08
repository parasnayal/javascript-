
console.log(" This tutorial is all about the filter method in javascript ");

// filter methods creates a new array with elements thst pass a test provided by a function
let array = [10, 20, 30, 40, 50, 60];
let result = [];
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element > 20) {
        result.push(element);
    }
}
console.log(result);

// ***** Another way using filter method *******
const result2 = array.filter(item => item>40);
console.log(result2);