console.log("This tutorial is all about the memoization in javascript");

let sum = 0 ;
const calc = (n) => {
    for(let i = 0 ; i<=n ; i++){
        sum+=i;
    }
    return sum;
};

const memoize = (func) => {

    let cache = {};

    return function(...args){
        console.log(...args);

        let n = args[0];

        if(n in cache){
            console.log("cache");
            return cache[n];
        }
        else{
            console.log("calculating first time");
            let result = func(n);
            cache[n] = result;
            return result;
        }
    }
}

console.time();
const paras = memoize(calc);
console.log('paras=>',paras(5));
console.timeEnd();

console.time();
console.log('paras=>',paras(5));
console.timeEnd();