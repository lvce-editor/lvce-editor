import { marked } from '../../../../../static/js/marked.js'

export const toHtml = (html, { baseUrl = '' } = {}) => {
  return marked(html, {
    baseUrl,
  })
}
