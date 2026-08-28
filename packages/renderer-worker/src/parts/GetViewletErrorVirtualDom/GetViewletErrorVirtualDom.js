import * as GetViewletErrorMessage from '../GetViewletErrorMessage/GetViewletErrorMessage.js'
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
  return [...messageDom, ...codeFrameDom, ...stackDom]
}
