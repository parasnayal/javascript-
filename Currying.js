console.log(" This tutuorial is all about the currying in javascript ");
// when a function, instead of taking all arguments at one time, takes the first one and returns a new function that takes the second one and returns a new function which takes the third one, and so forth, until all arguments have been fulfilled.

// function add(a,b,c){
//     return a+b+c;
// }
// let result = add(2,3,5);
// console.log(result);

function add(a) {
    return function (b) {
        return function (c) {
            return function (d) {
                return a + b + c + d;
            }
        }
    }
}
// let res1 = add(2);
// console.log(res1);
// let res2 = res1(3);
// console.log(res2);
// let res3 = res2(5);
// console.log(res3);
// let res4 = res3(10);
// console.log(res4);

let result = add(2)(3)(5)(10);
console.log(result);


// const createURL = (baseURL, path) => {
//     const protocol = "https";
//     return `${protocol}://${baseURL}/${path}`;
//   };

//   // create URLs for our main site
//   const homeURL = createURL("mysite.com", "");
//   const loginURL = createURL("mysite.com", "login");

//   // create URLs for our careers site
//   const careersHomeURL = createURL("mysite-careers.com", "");
//   const careersLoginURL = createURL("mysite-careers.com", "login");

//   console.log(homeURL);
//   console.log(loginURL);
//   console.log(careersHomeURL);
//   console.log(careersLoginURL);


//   Improve code by Using currying
const createURL = (baseURL) => {
    const protocol = "https";
    return path => {
        return `${protocol}://${baseURL}/${path}`;
    }
};
const createSiteURL = createURL("mysite.com");
const createCareersURL = createURL("mysite-careers.com");

// create URLs for our main site
const homeURL = createSiteURL("");
const loginURL = createSiteURL("login");
const productsURL = createSiteURL("products");
const contactURL = createSiteURL("contact-us");

// create URLs for our career site
const careersHomeURL = createCareersURL("");
const careersLoginURL = createCareersURL("login");


console.log("======> Infinite currying <====== ");
function add(a) {
    return function (b) {
        if (b) return add(a + b);
        return a;
    }
}
let res = add(2)(5)(3)();
console.log(res);