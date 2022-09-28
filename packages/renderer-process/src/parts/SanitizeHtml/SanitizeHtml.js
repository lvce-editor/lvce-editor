import DomPurify from '../../../../../static/js/dompurify.js'

export const sanitizeHtml = (html) => {
  return DomPurify.sanitize(html)
}
