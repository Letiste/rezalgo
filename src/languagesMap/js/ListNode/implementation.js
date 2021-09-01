class ListNode {
  constructor(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
  }
}

function arrayToLinkedList(arrayNode) {
  if (!arrayNode.length) return null;
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

function linkedListToArray(head) {
  const array = []
  let curr = head
  while (curr) {
    array.push(curr.val)
    curr = curr.next
  }
  return array
}
