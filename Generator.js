console.log(" This tutorial is all about the generator function in javascript ");
// Regular functions return only one, single value (or nothing).
// Generators can return (“yield”) multiple values, one after another, on-demand.
// yield statement returns a value and pauses the execution of the function
function *generatorFunc(){
    let i = 0;
    while(true){
        yield i++;
    }
}
let result = generatorFunc();
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());

