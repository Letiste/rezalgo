import { AdditionalDataStructures, FunctionSignature, LanguageMap, TypeMap } from '../LanguageMap';
import * as fs from 'fs';
import * as path from 'path';

const ListNode = {
  definition: fs.readFileSync(path.join(__dirname, './ListNode/definition.js')).toString(),
  implementation: fs.readFileSync(path.join(__dirname, './ListNode/implementation.js')).toString()
};

const TreeNode = {
  definition: fs.readFileSync(path.join(__dirname, './TreeNode/definition.js')).toString(),
  implementation: fs.readFileSync(path.join(__dirname, './TreeNode/implementation.js')).toString()
};

const additionalDataStructures: AdditionalDataStructures = {
  ListNode,
  TreeNode,
};

/**
 * The mapping used to render the helpers and
 * tests for this language
 */
export const languageMap: LanguageMap = {
  imports: [],
  beforeCodeUser: '',
  beforeTest: '',
  afterTest: '',
  if: ifTemplate,
  fi: '}',
  log: logTemplate,
  exit: 'process.exit(1)',
  functionCalledTemplate: functionCalledTemplate,
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: '}',
  timeStart: 'const timeStart = Date.now()',
  timeEnd: "console.log('TIME DURATION: ', Date.now() - timeStart)",
  memoryStart: 'const memoryStart = process.memoryUsage().heapUsed',
  memoryEnd: "console.log('MEMORY USAGE: ', process.memoryUsage().heapUsed - memoryStart)",
  comment: commentTemplate,
  variableAffectation: variableAffectation,
  additionalDataStructures,
};

/**
 * The mapping of the type in the challenge json file
 * and the language
 */
const typeMap: TypeMap = {
  float: 'number',
  integer: 'number',
  boolean: 'boolean',
  string: 'string',
  'Array<float>': 'number[]',
  'Array<integer>': 'number[]',
  'Array<boolean>': 'boolean[]',
  'Array<string>': 'string[]',
  ListNode: 'ListNode',
  TreeNode: 'TreeNode',
};

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate(actual: string, expected: string, type: keyof TypeMap): string {
  if (type === 'TreeNode') {
    return `if (JSON.stringify(binaryTreeToArray(${actual})) !== JSON.stringify(${expected})) {`;
  }
  if (type === 'ListNode') {
    return `if (JSON.stringify(linkedListToArray(${actual})) !== JSON.stringify(${expected})) {`;
  }
  return `if (JSON.stringify(${actual}) !== JSON.stringify(${expected})) {`;
}

/**
 * The function used to render the function called with
 * the given inputs
 */
function functionCalledTemplate(name: string, inputs: string[], inputsType?: (keyof TypeMap)[]): string {
  let template = `${name}(`;
  inputs.forEach((input, index) => {
    if (inputsType && inputsType[index] === 'ListNode') {
      input = `arrayToLinkedList(${input})`;
    }
    if (inputsType && inputsType[index] === 'TreeNode') {
      input = `arrayToBinaryTree(${input})`;
    }
    if (index === inputs.length - 1) {
      template += `${input})`;
    } else {
      template += `${input}, `;
    }
  });
  return template;
}

/**
 * The function used to print to stderr when the if
 * condition is true. It prints the inputs for which
 * it failed and the actual and expected values
 */
function logTemplate(actual: string, inputs: string[], expected: string, returnType: keyof TypeMap, hideExpected: boolean): string {
  if (hideExpected) {
    return `console.error(\`Inputs: ${inputs}\n Your answer was not correct\`)`;
  }
  if (returnType === 'TreeNode') {
    return `console.error(\`Inputs: ${inputs}\nExpected ${expected} but was \${JSON.stringify(binaryTreeToArray(${actual}))}\`)`;
  }
  if (returnType === 'ListNode') {
    return `console.error(\`Inputs: ${inputs}\nExpected ${expected} but was \${JSON.stringify(linkedListToArray(${actual}))}\`)`;
  }
  return `console.error(\`Inputs: ${inputs}\nExpected ${expected} but was \${JSON.stringify(${actual})}\`)`;
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
function defFunctionStartTemplate({ name, params, returnType }: FunctionSignature): string {
  const calledFunction = functionCalledTemplate(
    name,
    params.map((param) => Object.values(param)[0])
  );
  let template = '/**\n';
  for (const { name, type } of params) {
    template += ` * @param {${typeMap[type]}} ${name}\n`;
  }
  template += ` * @returns {${typeMap[returnType]}}\n`;
  template += ' */\n';
  template += `function ${calledFunction} {`;
  return template;
}

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return `// ${comment}`;
}

/**
 * The function used to create a variable and affect it a value
 */
function variableAffectation(name: string, _type: keyof TypeMap, value: string): string {
  return `const ${name} = ${value}`;
}
