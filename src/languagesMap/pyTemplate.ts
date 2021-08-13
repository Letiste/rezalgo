import { AdditionalDataStructures, FunctionSignature, LanguageMap, TypeMap } from './LanguageMap';

const ListNode = {
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
def arrayToLinkedList(arrayNode):
  if len(arrayNode) == 0:
    return None
  head = ListNode()
  next = head
  length = len(arrayNode)
  for i in range(0, length):
    next.val = arrayNode[i]
    if i == length - 1:
      next.next = None
    else:
      next.next = ListNode()
      next = next.next
  return head
def linkedListToArray(head):
  array = []
  curr = head
  while curr != None:
    array.append(curr.val)
    curr = curr.next
  return array
`,
};

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
def arrayToBinaryTree(arrayNode):
  if len(arrayNode) == 0 or arrayNode[0] == None:
    return None
  
  root = TreeNode(arrayNode[0])
  nodes = [root]
  i = 0
  while i < len(arrayNode) and len(nodes) > 0:
    node = nodes.pop(0)
    if 2*i+1 < len(arrayNode) and arrayNode[2*i+1] != None:
      left = TreeNode(arrayNode[2*i+1])
      node.left = left
      nodes.append(left)
  
    if 2*i+2 < len(arrayNode) and arrayNode[2*i+2] != None:
      right = TreeNode(arrayNode[2*i+2])
      node.right = right
      nodes.append(right)
  
    i += 1
  
  return root

def binaryTreeToArray(root):
  if root == None:
    return []
  
  arr = []
  nodes = [root]
  while len(nodes) > 0:
    node = nodes.pop(0)
    if node == None:
      arr.append(None)
      continue  
    else:
      arr.append(node.val)
    nodes.append(node.left)
    nodes.append(node.right)
  while arr[-1] == None:
    arr.pop()
  return arr
`,
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
  imports: ['import sys', 'import time', 'import resource', 'from typing import Union'],
  beforeCodeUser: '',
  beforeTest: '',
  afterTest: '',
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
  memoryEnd: "print('MEMORY USAGE: ', resource.getrusage(resource.RUSAGE_SELF).ru_maxrss * 1024)",
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
  'Array<float>': 'list[float]',
  'Array<integer>': 'list[int]',
  'Array<boolean>': 'list[bool]',
  'Array<string>': 'list[str]',
  ListNode: 'Union[ListNode, None]',
  TreeNode: 'Union[TreeNode, None]',
};

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate(actual: string, expected: string, type: keyof TypeMap): string {
  if (type === 'TreeNode') {
    return `if (binaryTreeToArray(${actual}) != ${expected.replace(/null/g, 'None')}) :`;
  }
  if (type === 'ListNode') {
    return `if (linkedListToArray(${actual}) != ${expected.replace(/null/g, 'None')}) :`;
  }
  return `if (${actual} != ${expected.replace(/null/g, 'None')}) :`;
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
      input = `arrayToBinaryTree(${input.replace(/null/g, 'None')})`;
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
    return `print(f"""Inputs: ${inputs.map((input) => input.replace(/null/g, 'None'))}\n Your answer was not correct""", file=sys.stderr)`;
  }
  if (returnType === 'TreeNode') {
    return `print(f"""Inputs: ${inputs.map((input) => input.replace(/null/g, 'None'))}\nExpected ${expected.replace(
      /null/g,
      'None'
    )} but was {binaryTreeToArray(${actual})}""", file=sys.stderr)`;
  }
  if (returnType === 'ListNode') {
    return `print(f"""Inputs: ${inputs}\nExpected ${expected} but was {linkedListToArray(${actual})}""", file=sys.stderr)`;
  }
  return `print(f"""Inputs: ${inputs.map((input) => input.replace(/null/g, 'None'))}\nExpected ${expected} but was {${actual}}""", file=sys.stderr)`;
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
      calledFunction += ', ';
    }
  });
  calledFunction += `) -> ${typeMap[returnType]}`;
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
  return `${name} = ${value}`;
}
