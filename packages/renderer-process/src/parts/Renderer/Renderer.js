const items = []

const cacheMap = new Map()

export const render = (root, renderer, data) => {
  if (!cacheMap.has(renderer)) {
    cacheMap.set(renderer, [])
  }
  const items = cacheMap.get(renderer)
  const childNodeLength = root.children.length
  if (childNodeLength < data.length) {
    for (let i = childNodeLength; i < data.length; i++) {
      const item = renderer.renderTemplate()
      items.push(item)
      root.append(item.root)
    }
  } else if (childNodeLength > data.length) {
    for (let i = data.length; i < childNodeLength; i++) {
      root.lastChild.remove()
      items.pop()
    }
  }
  root.ariaSetSize = data.length
  for (let i = 0; i < data.length; i++) {
    const item = items[i]
    item.root.ariaPosInSet = i
    renderer.renderElement(item, data[i], i)
  }
}
