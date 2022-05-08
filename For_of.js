console.log(" This tutorial is all about the for_of loop in javascript ");
// The hasOwnProperty() method returns a boolean indicating whether the object has the specified property as its own property (as opposed to inheriting it).

// For_of loop iterates over an iterable object such as=>
// (1) => Built-in Array, String, Map, Set, …
// (2) => Array-like objects such as arguments or NodeList
// (3) => User-defined objects that implement the iterator protocol.

console.log("------> Iterating over the array <------");
const array = [10,20,30];
for(let element of array){
    element+=5;
    console.log(element);
}

// entries => Returns an iterable of key, value pairs for every entry in the array
for(let [index,value] of array.entries()){
    // console.log('Index is =>',index);
    // console.log('Value is =>',value);
}

// keys => Returns an iterable of keys in the array
for(let key of array.keys()){
    // console.log('Key is => ',key);
}
// values => Returns an iterable of values in the array
for(let value of array.values()){
    // console.log('value is => ',value);
}

console.log("------> Iterating over string <------");
let str = "paras";
for(let word of str){
    console.log(word);
}
