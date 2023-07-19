import * as ParseHtml from '../ParseHtml/ParseHtml.js'
import * as Assert from '../Assert/Assert.js'

const allowedAttributes = ['src', 'id', 'className', 'title', 'alt', 'href', 'target', 'rel']

export const getMarkdownVirtualDom = (html) => {
  Assert.string(html)
  const dom = ParseHtml.parseHtml(html, allowedAttributes)
  return dom
}
