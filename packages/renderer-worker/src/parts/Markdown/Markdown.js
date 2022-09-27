import { marked } from '../../../../../static/js/marked.js'

export const toHtml = (html) => {
  return marked(html)
}
