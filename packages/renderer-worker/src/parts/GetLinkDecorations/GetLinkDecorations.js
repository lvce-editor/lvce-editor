import * as ComputeLinks from '../ComputeLinks/ComputeLinks.js'

export const getAllLinkDecorations = (editor) => {
  const { lines } = editor
  const decorations = []
  let offset = 0
  for (const line of lines) {
    const links = ComputeLinks.computeLinks(line, offset)
    decorations.push(...links)
    offset += line.length + 1
  }
  return decorations
}
