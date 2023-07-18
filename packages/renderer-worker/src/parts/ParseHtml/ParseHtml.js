import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.js'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.js'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const parseHtml = (html) => {
  const tokens = TokenizeHtml.tokenizeHtml(html)
  const dom = []
  const root = {
    type: 0,
    childCount: 0,
  }
  let current = root
  for (const token of tokens) {
    switch (token.type) {
      case HtmlTokenType.TagNameStart:
        current.childCount++
        current = {
          type: GetVirtualDomTag.getVirtualDomTag(token.text),
          childCount: 0,
        }
        dom.push(current)
        break
      case HtmlTokenType.TagNameEnd:
        break
      case HtmlTokenType.Content:
        current.childCount++
        dom.push(text(token.text))
        break
      default:
        break
    }
  }
  return dom
}
