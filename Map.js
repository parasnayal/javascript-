// map() => The map() method creates a new array populated with the results of calling a provided function on every element in the calling array. and return value is A new array with each element being the result of the callback function.It is not invoked for empty slots in sparse arrays.A sparse array remains sparse after map(). The indices of empty slots are still empty in the returned array, and the callback function won't be called on them  

const arr1 = [1,2,3,4,5];
const newArray = arr1.map(item=>item*2);
console.log(arr1,'arr1');
console.log(newArray,'newArray');