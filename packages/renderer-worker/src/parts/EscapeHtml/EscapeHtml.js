const RE_ESCAPE = /[<>&]/g

const replacer = (match) => {
  switch (match) {
    case '<':
      return '&lt;'
    case '>':
      return '&gt;'
    case '&':
      return '&amp;'
    default:
      return match
  }
}

export const escapeHtml = (html) => {
  return html.replaceAll(RE_ESCAPE, replacer)
}
