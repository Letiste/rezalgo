import { AdditionalDataStructures, FunctionSignature, LanguageMap, TypeMap } from "./LanguageMap"

const ListNode = {
  definition: `/**
* Definition for singly-linked list.
* class ListNode {
*   constructor(val, next) {
*     this.val = (val===undefined ? 0 : val)
*     this.next = (next===undefined ? null : next)
*   }
* }
*/
`,
  implementation: `class ListNode {
constructor(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
}
}
function instantiateLinkedList(arrayNode) {
  const head = new ListNode()
  let next = head
  arrayNode.forEach((node, indice) => {
    next.val = node
    if (indice === arrayNode.length - 1) {
      next.next = null
    } else {
      next.next = new ListNode()
      next = next.next
    }
  })
  return head
}
`
}

const TreeNode = {
  definition: `/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val, left, right) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
`,
  implementation: `class TreeNode {
  constructor(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
  }
}
`
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
  imports: [],
  beforeCodeUser: "",
  beforeTest: "",
  afterTest: "",
  if: ifTemplate,
  fi: "}",
  log: logTemplate,
  exit: "process.exit(1)",
  functionCalledTemplate: functionCalledTemplate,
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "}",
  timeStart: "const timeStart = Date.now()",
  timeEnd: "console.log('TIME DURATION: ', Date.now() - timeStart)",
  memoryStart: "const memoryStart = process.memoryUsage().heapUsed",
  memoryEnd: "console.log('MEMORY USAGE: ', process.memoryUsage().heapUsed - memoryStart)",
  comment: commentTemplate,
  variableAffectation: variableAffectation,
  additionalDataStructures,
}

/**
 * The mapping of the type in the challenge json file
 * and the language
 */
const typeMap: TypeMap = {
  float: "number",
  integer: "number",
  boolean: "boolean",
  string: "string",
  "Array<float>": "number[]",
  "Array<integer>": "number[]",
  "Array<boolean>": "boolean[]",
  "Array<string>": "string[]",
  ListNode: "ListNode"
}

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate(actual: string, expected: string): string {
  return `if (JSON.stringify(${actual}) !== JSON.stringify(${expected})) {`
}

/**
 * The function used to render the function called with
 * the given inputs
 */
function functionCalledTemplate(name: string, inputs: string[], inputsType?: (keyof TypeMap)[]): string {
  let template = `${name}(`
  inputs.forEach((input, index) => {
    if (inputsType && inputsType[index] === "ListNode") {
     input = `instantiateLinkedList(${input})`
    }
    if (index === inputs.length - 1) {
      template += `${input})`
    } else {
      template += `${input}, `
    }
  })
  return template
}

/**
 * The function used to print to stderr when the if
 * condition is true. It prints the inputs for which
 * it failed and the actual and expected values
 */
function logTemplate(actual: string, inputs: string[], expected: string): string {
  return `console.error(\`Inputs: ${inputs}\nExpected ${expected} but was \${JSON.stringify(${actual})}\`)`
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
function defFunctionStartTemplate({name, params, returnType}: FunctionSignature): string {
  const calledFunction = functionCalledTemplate(name, params.map(param => Object.values(param)[0]))
  let template = "/**\n"
  for (const {name, type} of params) {
    template += ` * @param {${typeMap[type]}} ${name}\n`
  }
  template += ` * @returns {${typeMap[returnType]}}\n`
  template += " */\n"
  template += `function ${calledFunction} {`
  return template
}

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return (`// ${comment}`)
}

/**
 * The function used to create a variable and affect it a value
 */
function variableAffectation(name: string, _type: keyof TypeMap, value: string): string {
  return `const ${name} = ${value}`
}
