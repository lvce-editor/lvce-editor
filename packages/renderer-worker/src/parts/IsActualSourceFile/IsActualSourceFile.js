export const isActualSourceFile = (path) => {
  if (path === '<anonymous>' || path === 'debugger eval code' || path.startsWith('"') || path.startsWith(`'`) || path.startsWith(')')) {
    return false
  }
  return true
}
