import { marked } from '../../../../../static/js/marked.js'

export const toHtml = (markdown, { baseUrl = '' } = {}) => {
  const html = marked(markdown, {
    baseUrl,
  })
  return html
}
