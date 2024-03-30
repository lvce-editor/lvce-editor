export const getHighlights = (item, leadingWord) => {
  const { matches } = item
  return matches.slice(1)
}
