import { AdditionalDataStructures, FunctionSignature, LanguageMap, TypeMap } from './LanguageMap';

const LinkedList = {
  definition: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
`,
  implementation: `class ListNode:
def __init__(self, val=0, next=None):
  self.val = val
  self.next = next
`
}

const TreeNode = {
  definition: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
`,
  implementation: `class TreeNode:
  def __init__(self, val=0, left=None, right=None):
    self.val = val
    self.left = left
    self.right = right
`
}

const additionalDataStructures: AdditionalDataStructures = {
  LinkedList,
  TreeNode,
}

/**
 * The mapping used to render the helpers and
 * tests for this language
 */ 
export const languageMap: LanguageMap = {
  imports: ['import sys', 'import time', 'import resource'],
  beforeCodeUser: "",
  beforeTest: "",
  afterTest: "",
  if: ifTemplate,
  fi: '',
  log: logTemplate,
  exit: 'sys.exit(1)',
  functionCalledTemplate: functionCalledTemplate,
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: '',
  timeStart: 'timeStart = int(round(time.time() * 1000))',
  timeEnd: "print('TIME DURATION: ', int(round(time.time() * 1000)) - timeStart)",
  memoryStart: '',
  memoryEnd: "print('MEMORY USAGE: ', resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)",
  comment: commentTemplate,
  variableAffectation: variableAffectation,
  additionalDataStructures,
};  

/**
 * The mapping of the type in the challenge json file
 * and the language
 */ 
const typeMap: TypeMap = {
  float: 'float',
  integer: 'int',
  boolean: 'bool',
  string: 'str',
  "Array<float>": 'list[float]',
  "Array<integer>": 'list[int]',
  "Array<boolean>": 'list[bool]',
  "Array<string>": 'list[str]',
};  

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate(actual: string, expected: string): string {
  return `if (${actual} != ${expected}) :`;
}

/**
 * The function used to render the function called with
 * the given inputs
 */
function functionCalledTemplate(name: string, inputs: string[]): string {
  let template = `${name}(`;
  inputs.forEach((input, index) => {
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
  return `print(f"""Inputs: ${inputs}\nExpected ${expected} but was {${actual}}""", file=sys.stderr)`;
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
function defFunctionStartTemplate({ name, params, returnType }: FunctionSignature): string {
  let calledFunction = `${name}(`;
  params.forEach(({ name, type }, index) => {
    calledFunction += `${name}: ${typeMap[type]}`;
    if (index < params.length - 1) {
      calledFunction += ", "
    }
  });
  calledFunction += `) -> ${typeMap[returnType]}`
  return `def ${calledFunction} :`;
}

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return `# ${comment}`;
}

/**
 * The function used to create a variable and affect it a value
 */
function variableAffectation(name: string, _type: keyof TypeMap, value: string): string {
  return `${name} = ${value}`
}
