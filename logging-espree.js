const escodegen = require('escodegen');
const espree = require('espree');
const estraverse = require('estraverse');

function addLogging(code) {
    const ast = espree.parse(code);
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression') {
                addBeforeCode(node);
            }
        }
    });
    return escodegen.generate(ast);
}

function addBeforeCode(node) {
    const name = node.id ? node.id.name : '<anonymous function>';
    const argumentsData = getArgumentsData(node.params);
    const beforeCode = "console.log('Entering " + name + argumentsData + "');";
    const beforeNodes = espree.parse(beforeCode).body;
    node.body.body = beforeNodes.concat(node.body.body);
}

function getArgumentsData(node) {
    let data = " ";
    for(let i = 0; i < node.length; i++) {
        data = data + "${ " + `${node[i].name}` + " }"
        if (i+1 < node.length) {
            data += ",";
        }
    }
    return data;
}

console.log(addLogging(`
function foo(a, b) {   
  var x = 'blah';   
  var y = (function (z) {
    return 3;
  })();
}
foo(1, 'wut', 3);
`));
