const items = []

export const render = (root, renderer, data) => {
  const childNodeLength = root.children.length
  if (childNodeLength < data.length) {
    for (let i = childNodeLength; i < data.length; i++) {
      const item = renderer.renderTemplate()
      items.push(item)
      root.append(item.root)
    }
  } else if (childNodeLength > data.length) {
    for (let i = data.length; i < childNodeLength; i++) {
      root.children[i].remove()
    }
  }
  for (let i = 0; i < data.length; i++) {
    renderer.renderElement(items[i], data[i], i)
  }
}
