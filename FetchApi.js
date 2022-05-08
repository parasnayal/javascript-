console.log(" This tutorial is all about the fetch api in javascript ");

// fetch api allows you to make http request to server from web browser
// fetch method returns a promise which you can handle using .then() and .catch() method
// after resolving a promise then again it returns a promise 

const URI = "paras.txt";
fetch(URI, {
    method: "get"
})
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(() => console.log("Oops! some error occured "));

// handle promise using async & await 
const uri = "paras.txt";
const func = async () => {
    const result = await fetch(uri, {
        method: "get"
    })
    const data = await result.text();
    console.log(data);
}
func();


const url = "https://api.github.com/users";
fetch(url, {
    method: "get"
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(() => console.log("Sorry! some error occured"))