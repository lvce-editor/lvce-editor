export const getWorkerDisplayName = (name) => {
  if (!name) {
    return '<unknown> worker'
  }
  if (name.endsWith('Worker')) {
    return name.toLowerCase()
  }
  return `${name} worker`
}
