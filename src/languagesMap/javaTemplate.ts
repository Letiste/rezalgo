import { AdditionalDataStructures, FunctionSignature, LanguageMap, TypeMap } from './LanguageMap';

const LinkedList = {
  definition: `/**
* Definition for singly-linked list.
* public class ListNode {
*     int val;
*     ListNode next;
*     ListNode() {}
*     ListNode(int val) { this.val = val; }
*     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
* }
*/
`,
  implementation: `public class ListNode {
int val;
ListNode next;
ListNode() {}
ListNode(int val) { this.val = val; }
ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
`
}

const TreeNode = {
  definition: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
`,
  implementation: `public class TreeNode {
  int val;
  TreeNode left;
  TreeNode right;
  TreeNode() {}
  TreeNode(int val) { this.val = val; }
  TreeNode(int val, TreeNode left, TreeNode right) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
`
}

const additionalDataStructures: AdditionalDataStructures = {
  LinkedList,
  TreeNode
}

/**
 * The mapping used to render the helpers and
 * tests for this language
 */
export const languageMap: LanguageMap = {
  imports: ["import java.util.*;"],
  beforeCodeUser: "public class Test {",
  beforeTest: "public static void main(String[] args) {",
  afterTest: "}}",
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
  "Array<float>": "List<Float>",
  "Array<integer>": "List<Integer>",
  "Array<boolean>": "List<Boolean>",
  "Array<string>": "List<String>",
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
    return `if (!${actual}.equals(Arrays.asList(${expected.replace(/[\[\]]/g, "")}))) {`
  }
  return `if (!${actual}.equals(${expected})) {`
}

/**
 * The function used to render the function called with
 * the given inputs
 */
function functionCalledTemplate(name: string, inputs: string[]): string {
  let template = `${name}(`;
  inputs.forEach((input, index) => {
    if (input.startsWith("[")) {
      input = `Arrays.asList(${input.slice(1, -1)})`
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
function logTemplate(actual: string, inputs: string[], expected: string): string {
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
