import * as NormalizeErrorLine from '../NormalizeErrorLine/NormalizeErrorLine.js'

export const mergeStacks = (parent, child) => {
  if (!child) {
    return parent
  }
  const parentNewLineIndex = parent.indexOf('\n')
  const childNewLineIndex = child.indexOf('\n')
  if (childNewLineIndex === -1) {
    return parent
  }
  const parentFirstLine = parent.slice(0, parentNewLineIndex)
  const childRest = child.slice(childNewLineIndex)
  const childFirstLine = NormalizeErrorLine.normalizeLine(child.slice(0, childNewLineIndex))
  if (parentFirstLine.includes(childFirstLine)) {
    return parentFirstLine + childRest
  }
  return child
}
