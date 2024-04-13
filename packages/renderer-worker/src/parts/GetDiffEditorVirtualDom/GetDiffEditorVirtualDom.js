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

const getPrefix = (type) => {
  switch (type) {
    case DiffType.Insertion:
      return insertion
    case DiffType.Deletion:
      return deletion
    case DiffType.None:
      return normal
  }
}

const getClassName = (type) => {
  switch (type) {
    case DiffType.Deletion:
      return ClassNames.Deletion
    case DiffType.Insertion:
      return ClassNames.Insertion
    case DiffType.None:
      return ''
  }
}

const renderLine = (value) => {
  const { line, lineInfo, type } = value
  if (lineInfo) {
    const dom = []
    dom.push({
      type: VirtualDomElements.Div,
      className: `${ClassNames.EditorRow} ${getClassName(type)}`,
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
  return [getPrefix(type), text(line)]
}

const getLinesVirtualDom = (lines, className) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `Editor ${ClassNames.DiffEditorContent} ${className}`,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'EditorContent',
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
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet DiffEditor',
      childCount: 4,
      onWheel: 'handleWheel',
    },
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
