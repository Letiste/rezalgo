class TreeNode {
  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}

function arrayToBinaryTree(arrayNode) {
  if (!arrayNode.length || arrayNode[0] === null) {
    return null
  }
  const root = new TreeNode(arrayNode[0])
  const nodes = [root]
  for (let i = 0; i < arrayNode.length && nodes.length; i++) {
    const node = nodes.shift()
    if (2*i+1 < arrayNode.length && arrayNode[2*i+1] !== null) {
      const left = new TreeNode(arrayNode[2*i+1])
      node.left = left
      nodes.push(left)
    }
    if (2*i+2 < arrayNode.length && arrayNode[2*i+2] !== null) {
      const right = new TreeNode(arrayNode[2*i+2])
      node.right = right
      nodes.push(right)
    }
  }
  return root
}

function binaryTreeToArray(root) {
  if (!root) return [];
  const arr = []
  const nodes = [root]
  while (nodes.length) {
    const node = nodes.shift()
    if (!node) {
      arr.push(null)
      continue
    } else {
      arr.push(node.val)
    }
    nodes.push(node.left)
    nodes.push(node.right)
  }
  while (arr[arr.length - 1] === null) {
    arr.pop()
  }
  return arr
}
