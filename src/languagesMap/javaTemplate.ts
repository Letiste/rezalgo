import { AdditionalDataStructures, FunctionSignature, LanguageMap, TypeMap } from './LanguageMap';

const ListNode = {
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
public ListNode arrayToLinkedList(List<Integer> arrayNode) {
  ListNode head = new ListNode();
  ListNode next = head;
  int size = arrayNode.size();
  for (int i = 0; i < size; i++) {
    next.val = arrayNode.get(i);
    if (i == size - 1) {
      next.next = null;
    } else {
      next.next = new ListNode();
      next = next.next;
    }
  }
  return head;
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
public TreeNode arrayToBinaryTree(List<Integer> arrayNode) {
  if (arrayNode.size() == 0 || arrayNode.get(0) == null) {
    return null;
  }
  TreeNode root = new TreeNode(arrayNode.get(0));
  Queue<TreeNode> nodes = new LinkedList<>();
  nodes.add(root);
  for (int i = 0; i < arrayNode.size() && nodes.size() > 0; i++) {
    TreeNode node = nodes.remove();
    if (2*i+1 < arrayNode.size() && arrayNode.get(2*i+1) != null) {
      TreeNode left = new TreeNode(arrayNode.get(2*i+1));
      node.left = left;
      nodes.add(left);
    }
    if (2*i+2 < arrayNode.size() && arrayNode.get(2*i+2) != null) {
      TreeNode right = new TreeNode(arrayNode.get(2*i+2));
      node.right = right;
      nodes.add(right);
    }
  }
  return root;
}

public List<Integer> binaryTreeToArray(TreeNode root) {
  if (root == null) {
    return new ArrayList<>();
  }
  List<Integer> arr = new ArrayList<>();
  Queue<TreeNode> nodes = new LinkedList<>();
  nodes.add(root);
  while (nodes.size() > 0) {
    TreeNode node = nodes.remove();
    if (node == null) {
      arr.add(null);
      continue;
    } else {
      arr.add(node.val);
    }
    nodes.add(node.left);
    nodes.add(node.right);
  }
  while (arr.get(arr.size() - 1) == null) {
    arr.remove((arr.size() - 1));
  }
  return arr;
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
  "Array<float>": "List<Float>",
  "Array<integer>": "List<Integer>",
  "Array<boolean>": "List<Boolean>",
  "Array<string>": "List<String>",
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
    return `if (!${actual}.equals(Arrays.asList(${expected.replace(/[\[\]]/g, "")}))) {`
  }
  if (type === 'TreeNode') {
    return `if (!binaryTreeToArray(${actual}).equals(Arrays.asList(${expected.replace(/[\[\]]/g, "")}))) {`
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
      input = `Arrays.asList(${input.slice(1, -1)})`
      input = `arrayToLinkedList(${input})`
    }
    if (inputsType && inputsType[index] === "TreeNode") {
      input = `Arrays.asList(${input.slice(1, -1)})`
      input = `arrayToBinaryTree(${input})`
    }
    if (inputsType && inputsType[index].startsWith('Array')) {
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
function logTemplate(actual: string, inputs: string[], expected: string, returnType: keyof TypeMap, hideExpected: boolean): string {
  if (hideExpected) {
    return `System.err.format("Inputs: ${inputs}\\n Your answer was not correct");`
  }
  if (returnType === "TreeNode") {
    return `System.err.format("Inputs: ${inputs}\\nExpected ${expected.replace(/["']/g, "\\\"")} but was %s\\n", binaryTreeToArray(${actual}));`
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
