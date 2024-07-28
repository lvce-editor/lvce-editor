const lineMap = Object.create(null)

export const setLines = (editorId: number, lines: readonly string[]) => {
  lineMap[editorId] = lines
}

export const getLines = (editorId: number) => {
  return lineMap[editorId]
}
