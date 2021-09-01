class TreeNode:
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
