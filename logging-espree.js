const escodegen = require('escodegen');
const espree = require('espree');
const estraverse = require('estraverse');
const fs = require('fs');
const program = require('commander');
const {version, description} = require('./package.json');

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
    const beforeCode = "console.log(`Entering " + name + argumentsData + "`);";
    const beforeNodes = espree.parse(beforeCode, {ecmaVersion:6}).body;
    node.body.body = beforeNodes.concat(node.body.body);
}

function getArgumentsData(node) {
    let data = " ";
    for(let i = 0; i < node.length; i++) {
        data = data + "${ " + `${node[i].name}` + " }"
        if (i+1 < node.length) {
            data += ", ";
        }
    }
    return data;
}

program
    .usage('<file> [options]')
    .version(version)
    .description(description)
    .option('-o, --output <fileName>', 'fichero de salida','out.js');
    program.parse(process.argv);

    if(program.args.length != 1) {
        program.help();
    }

    const fileName = program.args.shift();
    const outputFile = program.output;
    console.log(outputFile);

