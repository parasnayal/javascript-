console.log(" This tutorial is all about the shallow copy in javascript ");

// Shallow Copy => Shallow Copy stores the references of objects to the original memory address.Shallow Copy reflects changes made to the new/copied object in the original object.Shallow copy is faster.
const Person = {
    firstName: "Paras",
    lastName: "Nayal",
    age: 23
}
const coppiedPerson = Person;
//console.log("======> Before Modification <======");
// console.log(Person);
// console.log(coppiedPerson);

//console.log("======> After Modification <======");
coppiedPerson.age = 20000;
// console.log(Person);
// console.log(coppiedPerson);

const person2 = {
    firstName: "Bhuwan",
    lastName: "Bhatt",
    age: 24,
    address: {
        State: "Uttarakhand",
        City: "Haldwani"
    }
}
const coppiedPerson2 = person2;
//console.log("======> Before Modification <======");
// console.log(person2);
// console.log(coppiedPerson2);


//console.log("======> After Modification <======");
coppiedPerson2.firstName = "Naresh";
coppiedPerson2.address.City = "Khatima";
// console.log(person2);
// console.log(coppiedPerson2);

// Deep Copy => Deep copy stores copies of the object’s value.Deep copy doesn’t reflect changes made to the new/copied object in the original object.Deep copy is comparatively slower.
const Employee = {
    firstName:"Kishor",
    lastName:"Joshi",
    age:22,
    address:{
        State:"Uttrakhand",
        City:"Tanakpur"
    }
}
const coppiedEmployee = JSON.parse(JSON.stringify(Employee));

// console.log("======> Before Modification <======");
// console.log(Employee);
// console.log(coppiedEmployee);


// console.log("======> After Modification <======");
// coppiedEmployee.age = 30000;
// console.log(Employee);
// console.log(coppiedEmployee);


// console.log("======> spread operator <====== ");
// spread operator does not provide deep copy for the nested objects.It provide deep copy only if the array are not nested
const array = [10,20,30,40,50];
const coppiedArray = [...array];

// console.log("======> Before Modification <======");
// console.log(array);
// console.log(coppiedArray);

// console.log("======> After Modification <======");
// coppiedArray[2] = 30000;
// console.log(array);
// console.log(coppiedArray);

const array2 = [100,200,300,400,[1000,2000,3000]];
const coppiedArray2 = [...array2];

// console.log("======> Before Modification <======");
// console.log(array2);
// console.log(coppiedArray2);

// console.log("======> After Modification <======");
// coppiedArray2[2] = 10000;
// coppiedArray2[4][0] = 0;
// console.log(array2);
// console.log(coppiedArray2);

// console.log("======> Map <======");
const array3 = [5,10,15,20];
const coppiedArray3 = array3.map(item => item);

// console.log("======> Before Modification <======");
// console.log(array3);
// console.log(coppiedArray3);

// console.log("======> After Modification <======");
// coppiedArray3.push(500);
// console.log(array3);
// console.log(coppiedArray3);

const array4 = [2,4,6,8,10,[3,6,9,12]];
const coppiedArray4 = array4.map(item => item);

// console.log("======> Before Modification <======");
// console.log(array4);
// console.log(coppiedArray4);

// console.log("======> After Modification <======");
// coppiedArray4[2] = "Paras";
// coppiedArray4[5][0] ="Nayal";
// console.log(array4);
// console.log(coppiedArray4);


// ************  slice and forEach are simillar to the spread   *****************


// // ======> JSON methods provide complete Deep Copy <======
const array5 = [4,8,12,16,20,[9,18,27,36]];
const coppiedArray5 = JSON.parse(JSON.stringify(array5));

// console.log("======> Before Modification <======");
// console.log(array5);
// console.log(coppiedArray5);

// console.log("======> After Modification <======");
// coppiedArray5[5][0] = 90000;
// console.log(array5);
// console.log(coppiedArray5);

console.log("======> Object <======");
// Assign does not provide a complete copy
const obj1 = {
    Name:"Paras",
    role:"Reactjs Developer",
    Experience:"Fresher",
    bio(){return `Hello! I am ${this.Name} and my role is ${this.role}`},
    address:{
        State:"Uttrakhand",
        colony:"Chand Colony"
    }
}
const coppiedObj1 = Object.assign({},obj1);

console.log("======> Before Modification <======");
console.log(obj1);
console.log(coppiedObj1);

console.log("======> Before Modification <======");
coppiedObj1.Name="Rohan";
coppiedObj1.address['House No'] = 254;
console.log(obj1);
console.log(coppiedObj1);

// Spread operator works same