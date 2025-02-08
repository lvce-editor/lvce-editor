import * as Markdown from './Markdown.js'

export const name = 'Markdown'

export const Commands = {
  renderMarkdown: Markdown.renderMarkdown,
  getVirtualDom: Markdown.getVirtualDom,
}
