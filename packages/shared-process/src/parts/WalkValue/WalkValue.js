export const walkValue = (value, transferrables, isTransferrable) => {
  if (!value) {
    return
  }
  if (isTransferrable(value)) {
    transferrables.push(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      walkValue(item, transferrables, isTransferrable)
    }
    return
  }
  if (typeof value === 'object') {
    for (const property of Object.values(value)) {
      walkValue(property, transferrables, isTransferrable)
    }
    return
  }
}
