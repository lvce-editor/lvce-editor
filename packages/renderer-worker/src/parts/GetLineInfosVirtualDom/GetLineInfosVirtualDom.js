import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLineInfoVirtualDom = (lineInfo) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.HoverEditorRow,
      childCount: lineInfo.length / 2,
    },
  ]
  for (let i = 0; i < lineInfo.length; i += 2) {
    const tokenText = lineInfo[i]
    const tokenClass = lineInfo[i + 1]
    dom.push(
      {
        type: VirtualDomElements.Span,
        className: tokenClass,
        childCount: 1,
      },
      // @ts-ignore
      text(tokenText),
    )
  }
  return dom
}

export const getLineInfosVirtualDom = (lineInfos) => {
  const dom = lineInfos.flatMap(getLineInfoVirtualDom)
  return dom
}
