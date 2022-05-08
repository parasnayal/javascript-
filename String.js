console.log("This tutorial is all about the string and it's method in javascript ");
const string = "Hello! World";

const res1 = string.length;
// console.log(res1);

// Returns the character at the specified index.
const res2 = string.charAt(3);
// console.log(res2);

// Returns a string that contains the concatenation of two or more strings.
const res3 = string.concat(" Hello! I am paras");
// console.log(res3);

// The endsWith() method determines whether a string ends with the characters of a specified string, returning true or false as appropriate.
const res4 = string.endsWith("World")
// console.log(res4);

// The includes() method performs a case-sensitive search to determine whether one string may be found within another string, returning true or false as appropriate.
const res5 = string.includes("Hello!");
// console.log(res5);

// Returns the position of the first occurrence of a substring.
const res6 = string.indexOf("World");
// console.log(res6);

// Returns the last occurrence of a substring in the string.
const res7 = string.lastIndexOf("l");
// console.log(res7);

const res8 = string.padEnd(20,"paras Nayal");
// console.log(res8);

const res9 = string.padStart(20,"Hello!");
// console.log(res9);

const res10 = string.repeat(3);
// console.log(res10);

const res11 = string.replace("World","paras");
// console.log(res11);

const res12 = string.slice(1,8);
// console.log(res12);

const res13 = string.split("");
// console.log(res13);

const res14 = string.startsWith("Hello!");
// console.log(res14);

const res15 = string.substring(0);
// console.log(res15);
// let text = 'Mozilla'
// console.log(text.substring(5, 2))  
// console.log(text.slice(5, 2))  

const res16 = string.toLowerCase();
const res17 = string.toUpperCase();
// console.log(res16);
// console.log(res17);

const stringObj = new String("Hello! Paras");
console.log(stringObj);
console.log(stringObj.toString());

// The trim() method removes whitespace from both ends of a string and returns a new string
const string2 = "     Paras Nayal    ";
const res18 = string2.trim();
console.log(res18);
const res19 = string2.trimEnd();
console.log(res19);
const res20 = string2.trimStart();
console.log(res20);

// valueOf() => toString()

console.log(string);