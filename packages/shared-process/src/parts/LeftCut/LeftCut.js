const RE_WORD = /\b/g

export const leftCut = (text, final, charsBefore) => {
  if (text.length < charsBefore) {
    return text.length
  }
  let i = 0
  while (RE_WORD.test(text)) {
    if (final - RE_WORD.lastIndex < charsBefore) {
      break
    }
    i = RE_WORD.lastIndex
    RE_WORD.lastIndex++
  }
  RE_WORD.lastIndex = 0
  if (final - i > charsBefore + 10) {
    return final - charsBefore
  }
  return i
}
