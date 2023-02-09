import * as ComputeLinks from '../ComputeLinks/ComputeLinks.js'

const getAllLinkDecorations = (editor) => {
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

export const onChange = (editor) => {
  console.log('on change')
  const decorations = getAllLinkDecorations(editor)
  console.log({ decorations })
  if (decorations.length === 0) {
    return editor
  }
  return {
    ...editor,
    decorations,
  }
}
