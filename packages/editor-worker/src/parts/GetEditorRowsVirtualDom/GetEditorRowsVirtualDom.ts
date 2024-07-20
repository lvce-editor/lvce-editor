import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as Px from '../Px/Px.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getEditorRowsVirtualDom = (textInfos: any, differences: any, lineNumbers = true) => {
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
