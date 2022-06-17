const add = ($Parent, create$Element, count) => {
  const $Fragment = document.createDocumentFragment()
  for (let i = 0; i < count; i++) {
    $Fragment.append(create$Element())
  }
  $Parent.append($Fragment)
}

const remove = ($Parent, count) => {
  for (let i = 0; i < count; i++) {
    $Parent.lastChild.remove()
  }
}

export const ensure = ($Parent, create$Element, count) => {
  const diff = count - $Parent.childElementCount
  if (diff > 0) {
    add($Parent, create$Element, diff)
  } else if (diff < 0) {
    remove($Parent, -diff)
  }
}
