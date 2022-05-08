console.log(" This tutorial is all about the map and weakmap in javascript ");
// The map object holds key - value pairs and remember the original insertion order of keys.The data type of keys can be object and primitive.
let map = new Map();

//console.log(map);

const key1 = "string";
const key2 = {};
const key3 = function(){};

// Set value in the map object
map.set(key1,"This is a string")
map.set(key2,"This is a empty object")
map.set(key3,"This is a empty function")
console.log(map);

// Get the value from map object 
console.log(map.get(key1));
console.log(map.get(key2));

// *******  ITERATION ******
for(let [key,value] of map){
    // console.log(`Key is => ${key}`);
    // console.log(`value is => ${value}`);
}
for(let key of map.keys()){
    // console.log(`key is => ${key}`);
}
for(let value of map.values()){
    // console.log(`value is => ${value}`);
}
map.forEach((value,key)=>{
    console.log(value);
    console.log(key);
});

let mymap = new Map([[{name:"paras"},"this is an object"],[[10,20],"This is an array"]]);
console.log(mymap);
console.log(mymap.size);

// WeakMap => A weak map is simmilar to map excepts the keys of a weakMap must be objects
// (2) => elements of a weakmap can not be iterated
// (3) => can not check the size of the weakmap
let weakMap = new WeakMap([[{name:"nayal"},"This is an object"]]);
// let weakMap2 = new WeakMap([["paras","This is an object"]]);
console.log(weakMap);
// console.log(weakMap2);
