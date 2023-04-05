export const isActualSourceFile = (path) => {
  if (
    path === '<anonymous>' ||
    path === 'debugger eval code' ||
    path.startsWith('"') ||
    path.startsWith(`'`) ||
    path.startsWith(')') ||
    path.startsWith('file://')
  ) {
    return false
  }
  return true
}
