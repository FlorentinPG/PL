function foo(a, b) {
    console.log(`Entering foo ${ a }, ${ b }Línea: 1`);
    var x = 'blah';
    var y = function () {
        console.log(`Entering <anonymous function> Línea: 3`);
        return 3;
    }();
}
foo(1, 'wut', 3);