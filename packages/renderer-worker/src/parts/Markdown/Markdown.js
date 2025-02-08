import * as MarkdownWorker from '../MarkdownWorker/MarkdownWorker.js'

export const getVirtualDom = (html) => {
  return MarkdownWorker.invoke('Markdown.getVirtualDom', html)
}

export const renderMarkdown = (markdown, options) => {
  return MarkdownWorker.invoke('Markdown.renderMarkdown', markdown, options)
}
