import { AdditionalDataStructures, FunctionSignature, LanguageMap, TypeMap } from '../LanguageMap';
import * as fs from 'fs';
import * as path from 'path';

const ListNode = {
  definition: fs.readFileSync(path.join(__dirname, './ListNode/definition.java')).toString(),
  implementation: fs.readFileSync(path.join(__dirname, './ListNode/implementation.java')).toString()

}

const TreeNode = {
  definition: fs.readFileSync(path.join(__dirname, './TreeNode/definition.java')).toString(),
  implementation: fs.readFileSync(path.join(__dirname, './TreeNode/implementation.java')).toString()
}

const additionalDataStructures: AdditionalDataStructures = {
  ListNode,
  TreeNode
}

/**
 * The mapping used to render the helpers and
 * tests for this language
 */
export const languageMap: LanguageMap = {
  imports: ["import java.util.*;"],
  beforeCodeUser: "public class Test {",
  beforeTest: "public void test(){",
  afterTest: `}
  public static void main(String[] args) {
    Test runTest = new Test();
    runTest.test();
  }
}`,
  if: ifTemplate,
  fi: "}",
  log: logTemplate,
  exit: "System.exit(1);",
  functionCalledTemplate: functionCalledTemplate,
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "}",
  timeStart: "long timeStart = System.currentTimeMillis();",
  timeEnd: 'System.out.println("TIME DURATION: " + (System.currentTimeMillis() - timeStart));',
  memoryStart: "",
  memoryEnd: 'System.out.println("MEMORY USAGE: " + (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()));',
  comment: commentTemplate,
  variableAffectation: variableAffectation,
  additionalDataStructures
}

/**
 * The mapping of the type in the challenge json file
 * and the language
 */
const typeMap: TypeMap = {
  float: "float",
  integer: "int",
  boolean: "boolean",
  string: "String",
  "Array<float>": "float[]",
  "Array<integer>": "int[]",
  "Array<boolean>": "boolean[]",
  "Array<string>": "String[]",
  ListNode: "ListNode",
  TreeNode: 'TreeNode'
}

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate(actual: string, expected: string, type: keyof TypeMap): string {
  if (['float', 'integer', 'boolean'].includes(type)) {
    return `if (${actual} != ${expected}) {`
  }
  if (type.startsWith('Array')) {
    return `if (!Arrays.equals(${actual}, new ${typeMap[type]}{${expected.slice(1, -1)}})) {`
  }
  if (type === 'TreeNode') {
    return `if (!Arrays.equals(binaryTreeToArray(${actual}), new Integer[]{${expected.slice(1, -1)}})) {`
  }
  if (type === 'ListNode') {
    return `if (!Arrays.equals(linkedListToArray(${actual}), new Integer[]{${expected.slice(1, -1)}})) {`
  }
  return `if (!${actual}.equals(${expected})) {`
}

/**
 * The function used to render the function called with
 * the given inputs
 */
function functionCalledTemplate(name: string, inputs: string[], inputsType?: (keyof TypeMap)[]): string {
  let template = `${name}(`;
  inputs.forEach((input, index) => {
    if (inputsType && inputsType[index] === "ListNode") {
      input = `new Integer[]{${input.slice(1, -1)}}`
      input = `arrayToLinkedList(${input})`
    }
    if (inputsType && inputsType[index] === "TreeNode") {
      input = `new Integer[]{${input.slice(1, -1)}}`
      input = `arrayToBinaryTree(${input})`
    }
    if (inputsType && inputsType[index].startsWith('Array')) {
      input = `new ${typeMap[inputsType[index]]}{${input.slice(1, -1)}}`
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
    return `System.err.format("Inputs: ${inputs}\\n Your answer was not correct");`
  }
  if (returnType === "TreeNode") {
    return `System.err.format("Inputs: ${inputs}\\nExpected ${expected.replace(/["']/g, "\\\"")} but was %s\\n", Arrays.toString(binaryTreeToArray(${actual})));`
  }
  if (returnType === "ListNode") {
    return `System.err.format("Inputs: ${inputs}\\nExpected ${expected.replace(/["']/g, "\\\"")} but was %s\\n", Arrays.toString(linkedListToArray(${actual})));`
  }
  if (returnType.includes('Array')) {
    return `System.err.format("Inputs: ${inputs}\\nExpected ${expected.replace(/["']/g, "\\\"")} but was %s\\n", Arrays.toString(${actual}));`
  }
  return `System.err.format("Inputs: ${inputs}\\nExpected ${expected.replace(/["']/g, "\\\"")} but was %s\\n", ${actual});`
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
function defFunctionStartTemplate({name, params, returnType}: FunctionSignature): string {
  let calledFunction = `${name}(`;
  params.forEach(({ name, type }, index) => {
    calledFunction += `${typeMap[type]} ${name}`;
    if (index < params.length - 1) {
      calledFunction += ", "
    }
  });
  calledFunction += `)`
  return `public static ${typeMap[returnType]} ${calledFunction} {`;
}

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return `// ${comment}`
}

/**
 * The function used to create a variable and affect it a value
 */
function variableAffectation(name: string, type: keyof TypeMap, value: string) {
  return `${typeMap[type]} ${name} = ${value};`
}
