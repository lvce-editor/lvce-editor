export const first = () => {
  return 0
}

export const last = (items) => {
  return items.length - 1
}

export const next = (items, index) => {
  return (index + 1) % items.length
}

export const previous = (items, index) => {
  return index === 0 ? items.length - 1 : index - 1
}
