import * as MarkdownWorker from '../MarkdownWorker/MarkdownWorker.js'

export const getVirtualDom = (html) => {
  return MarkdownWorker.invoke('Markdown.getMarkDownVirtualDom', html)
}

export const renderMarkdown = (markdown, options) => {
  return MarkdownWorker.invoke('Markdown.renderMarkdown', markdown, options)
}

export const getVirtualDomFromMarkdown = async (markdown) => {
  const html = await renderMarkdown(markdown, { linksExternal: true })
  return getVirtualDom(html)
}
