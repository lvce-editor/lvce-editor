import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DiffType from '../DiffType/DiffType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const deletion = {
  type: VirtualDomElements.Div,
  className: `${ClassNames.EditorRow} ${ClassNames.Deletion}`,
  childCount: 1,
}

const insertion = {
  type: VirtualDomElements.Div,
  className: `${ClassNames.EditorRow} ${ClassNames.Insertion}`,
  childCount: 1,
}

const normal = {
  type: VirtualDomElements.Div,
  className: ClassNames.EditorRow,
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
      className: `${ClassNames.DiffEditorContent} ${ClassNames.DiffEditorContentLeft}`,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'EditorRows',
      childCount: linesLeft.length,
    },
    ...linesLeft.flatMap(renderLine),
    {
      type: VirtualDomElements.Div,
      className: 'Sash SashVertical',
      childcount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.DiffEditorContent} ${ClassNames.DiffEditorContentRight}`,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'EditorRows',
      childCount: linesRight.length,
    },
    ...linesRight.flatMap(renderLine),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBar,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBarThumb,
      childCount: 0,
    },
  ]
}
