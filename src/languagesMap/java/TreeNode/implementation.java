public class TreeNode {
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

public TreeNode arrayToBinaryTree(Integer[] arrayNode) {
  if (arrayNode.length == 0 || arrayNode[0] == null) {
    return null;
  }
  TreeNode root = new TreeNode(arrayNode[0]);
  Queue<TreeNode> nodes = new LinkedList<>();
  nodes.add(root);
  for (int i = 0; i < arrayNode.length && nodes.size() > 0; i++) {
    TreeNode node = nodes.remove();
    if (2*i+1 < arrayNode.length && arrayNode[2*i+1] != null) {
      TreeNode left = new TreeNode(arrayNode[2*i+1]);
      node.left = left;
      nodes.add(left);
    }
    if (2*i+2 < arrayNode.length && arrayNode[2*i+2] != null) {
      TreeNode right = new TreeNode(arrayNode[2*i+2]);
      node.right = right;
      nodes.add(right);
    }
  }
  return root;
}

public Integer[] binaryTreeToArray(TreeNode root) {
  if (root == null) {
    return new Integer[0];
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
  return arr.toArray(new Integer[0]);
}
