import * as GetViewletErrorMessage from '../GetViewletErrorMessage/GetViewletErrorMessage.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getTextSectionDom = (value, className, type = VirtualDomElements.Div) => {
  if (typeof value !== 'string' || !value) {
    return []
  }
  return [
    {
      childCount: 1,
      className,
      type,
    },
    text(value),
  ]
}

export const getViewletErrorVirtualDom = (error) => {
  const messageDom = getTextSectionDom(GetViewletErrorMessage.getViewletErrorTitle(error), 'ViewletErrorMessage')
  const codeFrameDom = Array.isArray(error?.syntaxHighlightedCodeFrame) ? error.syntaxHighlightedCodeFrame : []
  const stackDom = getTextSectionDom(error?.stack, 'ViewletErrorStack', VirtualDomElements.Pre)
  const sections = [messageDom, codeFrameDom, stackDom].filter((section) => section.length > 0)
  return [
    {
      childCount: sections.length,
      className: MergeClassNames.mergeClassNames('Viewlet', 'Error'),
      type: VirtualDomElements.Div,
    },
    ...sections.flat(),
  ]
}
