import * as Assert from '../Assert/Assert.js'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.js'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.js'
import * as IsSelfClosingTag from '../IsSelfClosingTag/IsSelfClosingTag.js'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const parseHtml = (html, allowedAttributes) => {
  Assert.string(html)
  Assert.array(allowedAttributes)
  const tokens = TokenizeHtml.tokenizeHtml(html)
  const dom = []
  const root = {
    type: 0,
    childCount: 0,
  }
  let current = root
  const stack = [root]
  let attributeName = ''
  for (const token of tokens) {
    switch (token.type) {
      case HtmlTokenType.TagNameStart:
        current.childCount++
        current = {
          type: GetVirtualDomTag.getVirtualDomTag(token.text),
          childCount: 0,
        }
        dom.push(current)
        if (!IsSelfClosingTag.isSelfClosingTag(token.text)) {
          stack.push(current)
        }
        break
      case HtmlTokenType.TagNameEnd:
        stack.pop()
        current = stack.at(-1) || root
        break
      case HtmlTokenType.Content:
        current.childCount++
        dom.push(text(token.text))
        break
      case HtmlTokenType.AttributeName:
        attributeName = token.text
        break
      case HtmlTokenType.AttributeValue:
        if (allowedAttributes.includes(attributeName)) {
          current[attributeName] = token.text
        }
        attributeName = ''
        break
      default:
        break
    }
  }
  return dom
}
