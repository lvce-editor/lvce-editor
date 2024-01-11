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

const renderLineDeletion = (value) => {
  const { line } = value
  return [deletion, text(line)]
}

const renderLineInsertion = (value) => {
  const { line, lineInfo } = value
  if (lineInfo) {
    const dom = []
    dom.push({
      type: VirtualDomElements.Div,
      className: `${ClassNames.EditorRow} ${ClassNames.Insertion}`,
      childCount: lineInfo.length / 2,
    })
    for (let i = 0; i < lineInfo.length; i += 2) {
      const tokenText = lineInfo[i]
      const className = lineInfo[i + 1]
      dom.push(
        {
          type: VirtualDomElements.Span,
          className,
          childCount: 1,
        },
        text(tokenText),
      )
    }
    return dom
  }
  return [insertion, text(line)]
}

const renderLineNormal = (value) => {
  const { line } = value
  return [normal, text(line)]
}

const renderLine = (value) => {
  const { type } = value
  switch (type) {
    case DiffType.Deletion:
      return renderLineDeletion(value)
    case DiffType.Insertion:
      return renderLineInsertion(value)
    case DiffType.None:
      return renderLineNormal(value)
    default:
      return []
  }
}

const getLinesVirtualDom = (lines, className) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.DiffEditorContent} ${className}`,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'EditorRows',
      childCount: lines.length,
    },
    ...lines.flatMap(renderLine),
  ]
}

export const getDiffEditorVirtualDom = (linesLeft, linesRight) => {
  return [
    ...getLinesVirtualDom(linesLeft, ClassNames.DiffEditorContentLeft),
    {
      type: VirtualDomElements.Div,
      className: 'Sash SashVertical',
      childcount: 0,
    },
    ...getLinesVirtualDom(linesRight, ClassNames.DiffEditorContentRight),
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
