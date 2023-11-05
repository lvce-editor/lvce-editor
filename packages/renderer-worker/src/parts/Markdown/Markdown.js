import * as LoadMarked from '../LoadMarked/LoadMarked.js'

export const toHtml = async (markdown, { baseUrl = '' } = {}) => {
  const marked = await LoadMarked.loadMarked()
  const html = marked(markdown, {
    baseUrl,
  })
  return html
}
