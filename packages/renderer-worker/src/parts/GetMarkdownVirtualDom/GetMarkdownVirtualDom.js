import * as AllowedMarkdownAttributes from '../AllowedMarkdownAttributes/AllowedMarkdownAttributes.js'
import * as Assert from '../Assert/Assert.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.js'

export const getMarkdownVirtualDom = (html) => {
  Assert.string(html)
  const dom = ParseHtml.parseHtml(html, AllowedMarkdownAttributes.allowedMarkdownAttributes)
  return dom
}
