import * as ParseHtml from '../ParseHtml/ParseHtml.js'
import * as Assert from '../Assert/Assert.js'

export const getMarkdownVirtualDom = (html) => {
  Assert.string(html)
  const dom = ParseHtml.parseHtml(html)
  return dom
}
