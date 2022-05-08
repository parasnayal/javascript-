console.log(" This tutorial is all about the event and event loop in javascript ");

// javascript synchronous , blocking and single threaded language.

// Event => The change in the state of an object is known as event in javascript

// Event handling => Process of reacting over the events is called event handling

// Asynchronous javascript => Asynchronous code allows the program to be executed immediately where the synchronous code will block further execution of the remaining code until it finishes the current one.

// To achieve the asynchronous behaviour or non blocking call we used callback function , promise etc

//(1) => functions get pushed into the call stack when they were invoked and popped off when they returned a value.
// (2) => settimeout is provide to you by the browser , the web api take care of the callback function which we pass to it.
// (3) => when the timer has finished , tha callback passed to the callback queue
// (4) => The event loop looks the callback queue and callstack.if the callstack is empty , it pushes the first item in the queue onto the stack 
// (5) => The callback is added to the call stack and executed . once it returned a value , it gets popped off the call stack

function greet(){
    return "Hello! World"
}
function respond(){
    setTimeout(() => {
        console.log("Hello! Javasript");
    }, 3000);
    console.log("I am inside the function");
}
console.log(greet());
respond();
console.log("outside function");

// console.log("Start");
// setTimeout(() => {
//     console.log(" This is the callback function of settimeout ");
// }, 3000);
// fetch("https://api.github.com/users",{
//     method:"get"
// })
// .then(res => {
//     console.log("This is first response");
//     return res.json()
// })
// .then(data => {
//     console.log(data);
//     console.log("This is the second response");
// })
// .catch(() => console.log("Oops! some error occured"));
// console.log("End");
