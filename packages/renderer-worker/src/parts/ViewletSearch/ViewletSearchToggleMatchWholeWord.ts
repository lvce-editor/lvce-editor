export const toggleMatchWholeWord = (state) => {
  const { matchWholeWord } = state
  return {
    ...state,
    matchWholeWord: !matchWholeWord,
  }
}
