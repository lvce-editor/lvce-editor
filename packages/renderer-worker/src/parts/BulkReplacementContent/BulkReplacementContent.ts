import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'
import type { TextEdit } from '../TextEdit/TextEdit.ts'

export const getNewContent = (oldContent: string, changes: readonly TextEdit[]): string => {
  if (changes.length === 0) {
    return oldContent
  }
  let rowIndex = 0
  let newLineIndex = -1
  let copiedContentIndex = 0
  let newContent = ''
  for (let i = 0; i < changes.length; i++) {
    // TODO support multiline changes
    const { text, startColumnIndex, startRowIndex, endColumnIndex } = changes[i]
    while (rowIndex < startRowIndex) {
      newLineIndex = GetNewLineIndex.getNewLineIndex(oldContent, newLineIndex + 1)
      rowIndex++
    }
    const lineStartIndex = newLineIndex + 1
    const startContentIndex = lineStartIndex + startColumnIndex
    const endContentIndex = lineStartIndex + endColumnIndex
    newContent += oldContent.slice(copiedContentIndex, startContentIndex)
    newContent += text
    copiedContentIndex = endContentIndex
  }
  return newContent + oldContent.slice(copiedContentIndex)
}
