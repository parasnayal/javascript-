// The Map object holds key-value pairs and remember the original insertion order of the keys.Any value (both objects and primitive values) may be used as either a key or a value.

const map1 = new Map();
map1.set('a',10);
map1.set('b','20');
map1.set('c',30);
map1.set('obj',{firstName:"Paras",lastName:"Nayal",role:"developer"})

console.log(map1)

// Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object
const getValue = map1.get('a');
const getValue2 = map1.get('obj')
const sizeOfMapObject = map1.size
console.log(getValue)
console.log(getValue2);
console.log(sizeOfMapObject);

// Return => true if an element in the Map existed and has been removed, or false if the element does not exist.
// const deleteElement = map1.delete('obj')
// console.log(deleteElement)

// Return value => undefined
// const deleteAllElement = map1.clear();
// console.log(deleteAllElement)

// Returns an iterable of key, value pairs(in an insertion order) for every entry in the map.
const iterator1 = map1.entries();
console.log(iterator1)
const firstIteratorvalue = iterator1.next().value
const secondIteratorvalue = iterator1.next().value
const thirdIteratorvalue = iterator1.next().value
const fourthIteratorvalue = iterator1.next().value
console.log(firstIteratorvalue)
console.log(secondIteratorvalue)
console.log(thirdIteratorvalue)
console.log(fourthIteratorvalue)

// The forEach() method executes a provided function once per each key/value pair in the Map object, in insertion order. Return value => undefined.

map1.forEach((value,key)=>{
    console.log(value,'value inside the map object');
    console.log(key,'Key inside the the map object');
})
// The has() method returns a boolean indicating whether an element with the specified key exists or not.
const isElementPresent = map1.has('a');
console.log(isElementPresent,'isElementPresent')

// Returns an iterable of keys in the map in an insertion order
const keyIterator = map1.keys()
console.log(keyIterator)
const keyIteratorValue = keyIterator.next().value
console.log(keyIteratorValue)

// Returns an iterable of values in the map
const valueIterator = map1.values();
console.log(valueIterator)
const valueIteratorValue = valueIterator.next().value;
console.log(valueIteratorValue)