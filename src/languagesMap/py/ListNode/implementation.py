class ListNode:
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
