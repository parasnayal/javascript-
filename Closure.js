console.log(" This tutorial is all about the closure in javascript ");
// closure is the combination of function bundled together with it's reference to the parent's scope (lexical environment)
function a() {
    let c = 10;
    function d() {
        console.log(b);
        console.log(c);
    }
    d();
}
let b = 10;
a();