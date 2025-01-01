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
  let previousNewLineIndex = -1
  for (let i = 0; i < changes.length; i++) {
    // TODO support multiline changes
    const { text, startColumnIndex, startRowIndex, endColumnIndex } = changes[i]
    while (rowIndex < startRowIndex) {
      previousNewLineIndex = newLineIndex
      newLineIndex = GetNewLineIndex.getNewLineIndex(oldContent, newLineIndex + 1)
      rowIndex++
    }
    if (copiedContentIndex <= newLineIndex) {
      newContent += oldContent.slice(copiedContentIndex, newLineIndex + 1)
      copiedContentIndex = newLineIndex + 1
    }
    newContent += text
    copiedContentIndex += endColumnIndex - startColumnIndex
  }
  return newContent
}
