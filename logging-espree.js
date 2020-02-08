const escodegen = require('escodegen');
const espree = require('espree');
const estraverse = require('estraverse');
const fs = require('fs');

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

var helpNeeded = false;
var inputFile = "";
var outputFile = "out.js";
var isUnkown = false;
for (var i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case '-i':
        case '--input':
            inputFile = process.argv[++i];
            break;
        case '-o':
        case '--output':
            outputFile = process.argv[++i];
            break;
        case '-h':
        case '--help':
            helpNeeded = true;
            break;
        default:
            console.log("Unkown option detected");
            isUnkown = true;
            break;
    }
}

if(helpNeeded || process.argv.length == 2 || isUnkown) {
    console.log(`Usage: logging-espree.js [options]\n
Options:\n
    -i, --input <filename>\t\tSpecify the input file.\n
    -o, --output <filename>\t\tSpecify the output file. By defect, "out.js".\n
    -h, --help\t\t\t\tOutput usage information.`)
}else if (!inputFile) {
    console.log(`You have to specify an input file. Check the program help with -h or the --help options to know more about.`)
}else {
    let archivo = fs.readFileSync(inputFile, 'utf-8');
    fs.writeFile(outputFile,addLogging(archivo), error => {
        if (error)
            console.log(error);
        else 
            console.log(`The output file, "${outputFile}", has been created successfully.`);
    });
}
