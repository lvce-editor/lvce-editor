import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.ts'
import * as NormalizeErrorLine from '../NormalizeErrorLine/NormalizeErrorLine.ts'

export const mergeStacks = (parent: string, child: string) => {
  if (!child) {
    return parent
  }
  const parentNewLineIndex = GetNewLineIndex.getNewLineIndex(parent)
  const childNewLineIndex = GetNewLineIndex.getNewLineIndex(child)
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
