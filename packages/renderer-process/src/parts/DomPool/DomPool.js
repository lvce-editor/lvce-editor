const createDomPool = (renderTemplate, renderElement) => {
  const items = []

  const pop = () => {
    if (items.length === 0) {}
    return items.pop()
  }

  const push = (item) => {
    items.push(item)
  }

  return {
    push,
    pop,
  }
}
