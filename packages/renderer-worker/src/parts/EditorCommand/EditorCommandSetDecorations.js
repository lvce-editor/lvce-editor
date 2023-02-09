import * as DecorationType from '../DecorationType/DecorationType.js'

const mergeDecorations = (decorations, newDecorations) => {
  const mergedDecorations = []
  for (let i = 0; i < decorations.length; i += 4) {
    if (decorations[i + 2] === DecorationType.Link) {
      mergedDecorations.push(decorations[i], decorations[i + 1], decorations[i + 2], decorations[i + 3])
    }
  }
  mergedDecorations.push(...newDecorations)
  return mergedDecorations
}

export const setDecorations = (editor, newDecorations) => {
  const { decorations } = editor
  const mergedDecorations = mergeDecorations(decorations, newDecorations)
  console.log({ mergedDecorations, decorations })
  return {
    ...editor,
    decorations: mergedDecorations,
  }
}
