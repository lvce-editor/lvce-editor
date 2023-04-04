export const hasTransferrableResult = (method) => {
  switch (method) {
    case 'IpcParent.create':
      return true
    default:
      return false
  }
}
