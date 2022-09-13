const RE_WORD_START = /^\w+/

const RE_WORD_END = /\w+$/

export const getWordAt = (editor, rowIndex, columnIndex) => {
  const line = editor.lines[rowIndex]
  const before = line.slice(0, columnIndex)
  const matchBefore = before.match(RE_WORD_END)
  const after = line.slice(columnIndex)
  const matchAfter = after.match(RE_WORD_START)
  let word = ''
  if (matchBefore) {
    word += matchBefore[0]
  }
  if (matchAfter) {
    word += matchAfter[0]
  }
  return {
    word,
  }
}
