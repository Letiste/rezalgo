public class ListNode {
  int val;
  ListNode next;
  ListNode() {}
  ListNode(int val) { this.val = val; }
  istNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public ListNode arrayToLinkedList(Integer[] arrayNode) {
  if (arrayNode.length == 0) {
      return null;
  }
  ListNode head = new ListNode();
  ListNode next = head;
  int size = arrayNode.length;
  for (int i = 0; i < size; i++) {
      next.val = arrayNode[i];
      if (i == size - 1) {
          next.next = null;
      } else {
          next.next = new ListNode();
          next = next.next;
      }
  }
  return head;
}
public Integer[] linkedListToArray(ListNode head) {
  List<Integer> array = new ArrayList<>();
  ListNode curr = head;
  while (curr != null) {
      array.add(curr.val);
      curr = curr.next;
  }
  return array.toArray(new Integer[0]);
}
