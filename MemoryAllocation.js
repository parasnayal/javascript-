console.log(" This tutorial is all about the memory allocation in javascript ");
// Allocating memory is the process of reserving space in memory, while releasing memory frees up space, ready to be used for another purpose.
// memory life cycle => allocate => use => release

// JavaScript engines have two places where they can store data: The memory heap and stack.

const name = "paras";
const age = 23;
const male = true;

// All the values get stored in the stack since they all contain primitive values.

// A stack is a data structure that JavaScript uses to store static data. Static data is data where the engine knows the size at compile time. In JavaScript, this includes primitive values (strings, numbers, booleans, undefined, and null) and references, which point to objects and functions.
// Since the engine knows that the size won't change, it will allocate a fixed amount of memory for each value.
// The process of allocating memory right before execution is known as static memory allocation.


// The heap is a different space for storing data where JavaScript stores objects and functions.
// Unlike the stack, the engine doesn't allocate a fixed amount of memory for these objects. Instead, more space will be allocated as needed.
// Allocating memory this way is also called dynamic memory allocation.

const person = {
    name: 'John',
    age: 24,
  };
//   JS allocates memory for this object in the heap. The actual values are still primitive, which is why they are stored in the stack.

const hobbies = ['hiking', 'reading'];
// Arrays are objects as well, which is why they are stored in the heap.


// ********* REFERENCES IN JAVASCRIPT ***********

// All variables first point to the stack. In case it's a non-primitive value, the stack contains a reference to the object in the heap.
// The memory of the heap is not ordered in any particular way, which is why we need to keep a reference to it in the stack. You can think of references as addresses and the objects in the heap as houses that these addresses belong to.

