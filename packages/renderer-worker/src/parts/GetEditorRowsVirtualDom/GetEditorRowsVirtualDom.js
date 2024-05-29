import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as Px from '../Px/Px.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getEditorRowsVirtualDom = (textInfos, differences, lineNumbers = true) => {
  const dom = []
  for (let i = 0; i < textInfos.length; i++) {
    const textInfo = textInfos[i]
    const difference = differences[i]
    dom.push({
      type: VirtualDomElements.Div,
      className: ClassNames.EditorRow,
      translate: Px.px(difference),
      childCount: textInfo.length / 2,
    })
    for (let j = 0; j < textInfo.length; j += 2) {
      const tokenText = textInfo[j]
      const className = textInfo[j + 1]
      dom.push(
        {
          type: VirtualDomElements.Span,
          className,
          childCount: 1,
        },
        text(tokenText),
      )
    }
  }
  return dom
}
