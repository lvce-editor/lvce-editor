import { marked } from '../../../../../static/js/marked.js'

const renderer = {
  image(href, title, text) {
    return `<img src="${href}" title="${title}" alt="${text}" crossorigin="anonymous" />`
  },
}

marked.use({ renderer })

export const toHtml = (html) => {
  return marked(html)
}
