import DomPurify from '../../../../../static/js/dompurify.js'

// https://github.com/cure53/DOMPurify/issues/317#issuecomment-698800327
DomPurify.addHook('afterSanitizeAttributes', (node) => {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noreferrer noopener nofollow')
  }
})

export const sanitizeHtml = (html) => {
  return DomPurify.sanitize(html)
}
