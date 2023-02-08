export const first = () => {
  return 0
}

export const last = (items) => {
  return items.length - 1
}

export const next = (items, index) => {
  return (index + 1) % items.length
}

export const nextNoCycle = (items, index) => {
  if (index === items.length - 1) {
    return index
  }
  return index + 1
}

export const previous = (items, index) => {
  return index === 0 ? items.length - 1 : index - 1
}

export const previousNoCycle = (items, index) => {
  return index === 0 ? 0 : index - 1
}
