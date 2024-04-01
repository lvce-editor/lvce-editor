export const getWorkerDisplayName = (name) => {
  if (!name) {
    return '<unknown> worker'
  }
  if (name.endsWith('Worker') || name.endsWith('worker')) {
    return name.toLowerCase()
  }
  return `${name} Worker`
}
