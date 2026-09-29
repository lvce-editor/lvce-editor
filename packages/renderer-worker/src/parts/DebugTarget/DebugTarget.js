let target

export const set = (newTarget) => {
  target = newTarget
}

export const consume = () => {
  const currentTarget = target
  target = undefined
  return currentTarget
}
