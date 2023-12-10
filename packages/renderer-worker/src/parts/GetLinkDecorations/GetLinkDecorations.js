import * as ComputeLinks from '../ComputeLinks/ComputeLinks.js'

export const getAllLinkDecorations = (editor) => {
  const { lines } = editor
  const decorations = []
  let offset = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const links = ComputeLinks.computeLinks(line, offset)
    decorations.push(...links)
    offset += line.length + 1
  }
  return decorations
}
