export const getPossibleLinkDecoration = (editor, position) => {
  const { decorations, lines } = editor
  const rowIndex = 0
  let offset = 0
  let lineIndex = 0
  for (let i = 0; i < decorations.length; i += 4) {
    const decorationOffset = decorations[i]
    if (decorationOffset >= offset && rowIndex === position.rowIndex) {
      return {
        url: 'https://example.com',
      }
    }
    while (offset < decorationOffset && lineIndex < lines.length) {
      lineIndex++
      const line = lines[i]
      offset += line.length
    }
  }
  return undefined
}
