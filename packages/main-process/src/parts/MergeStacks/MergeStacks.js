const GetNewLineIndex = require('../GetNewLineIndex/GetNewLineIndex.js')
const NormalizeErrorLine = require('../NormalizeErrorLine/NormalizeErrorLine.js')

exports.mergeStacks = (parent, child) => {
  if (!parent) {
    throw new Error(`parent stack cannot be empty`)
  }
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
