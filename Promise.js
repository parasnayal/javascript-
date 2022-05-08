console.log(" This tutorial is all about the promises in javascript ");

// A promise object represent completition or failure of a asynchronous operation
// A promise has one of these state
// (1) => Fullfilled
// (2) => reject
// (3) => pending

const getData = () => {
    return new Promise((resolve, reject) => {
        let error = true;
        if (!error) {
            console.log("Promise has been fullfilled");
            resolve();
        }
        else {
            console.log("Promise has not been fullfilled");
            reject()
        }
    })
}
getData()
    .then(() => console.log("This is resolve function"))
    .catch(() => console.log("This is reject function "));

// *********  ANOTHER EXAMPLE ********
const students = [
    { name: "paras", role: "developer" },
    { name: "bhuwan", role: " Software tester" },
];

const enrollStudent = student => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            students.push(student);
            let error = false;
            if (!error) {
                resolve();
            }
            else {
                reject()
            }
        }, 3000);
    })
}
const newStudent = { name: "kishor", role: "devops" };
enrollStudent(newStudent)
    .then(() => console.log(students))
    .catch(() => console.log("ERROR!"));