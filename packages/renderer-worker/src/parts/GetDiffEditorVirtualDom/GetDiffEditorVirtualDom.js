import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const renderLineDeletion = (content) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'EditorRow Deletion',
      childCount: 1,
    },
    text(content),
  ]
}

const renderLineInsertion = (content) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'EditorRow Insertion',
      childCount: 1,
    },
    text(content),
  ]
}

const renderLine = (line) => {
  const { type, text } = line
  switch (type) {
    case 'deletion':
      return renderLineDeletion(text)
    case 'insertion':
      return renderLineInsertion(text)
    default:
      return []
  }
}

export const getDiffEditorVirtualDom = (linesLeft, linesRight) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'DiffEditorContentLeft',
      childCount: linesLeft.length,
    },
    ...linesLeft.flatMap(renderLine),
    {
      type: VirtualDomElements.Div,
      className: 'DiffEditorContentRight',
      childCount: linesRight.length,
    },
    ...linesRight.flatMap(renderLine),
  ]
}
