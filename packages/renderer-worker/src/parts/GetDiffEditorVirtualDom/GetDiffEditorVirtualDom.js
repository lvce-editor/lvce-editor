import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DiffType from '../DiffType/DiffType.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const deletion = {
  type: VirtualDomElements.Div,
  className: 'EditorRow Deletion',
  childCount: 1,
}

const insertion = {
  type: VirtualDomElements.Div,
  className: 'EditorRow Insertion',
  childCount: 1,
}

const normal = {
  type: VirtualDomElements.Div,
  className: 'EditorRow',
  childCount: 1,
}

const renderLineDeletion = (content) => {
  return [deletion, text(content)]
}

const renderLineInsertion = (content) => {
  return [insertion, text(content)]
}

const renderLineNormal = (content) => {
  return [normal, text(content)]
}

const renderLine = (value) => {
  const { type, line } = value
  switch (type) {
    case DiffType.Deletion:
      return renderLineDeletion(line)
    case DiffType.Insertion:
      return renderLineInsertion(line)
    case DiffType.None:
      return renderLineNormal(line)
    default:
      return []
  }
}

export const getDiffEditorVirtualDom = (linesLeft, linesRight) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'DiffEditorContent DiffEditorContentLeft',
      childCount: linesLeft.length,
    },
    ...linesLeft.flatMap(renderLine),
    {
      type: VirtualDomElements.Div,
      className: 'DiffEditorContent DiffEditorContentRight',
      childCount: linesRight.length,
    },
    ...linesRight.flatMap(renderLine),
  ]
}

export const getContentDom = (linesLeft) => {
  return linesLeft.flatMap(renderLine)
}
