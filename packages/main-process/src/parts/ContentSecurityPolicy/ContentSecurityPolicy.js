const addSemicolon = (line) => {
  return line + ';'
}

exports.key = 'Content-Security-Policy'

exports.value = [
  `default-src 'none'`,
  `connect-src self`,
  `font-src 'self' https:`,
  `frame-src *`,
  `img-src 'self' https: data:`,
  `media-src 'none'`,
  `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`, // TODO remove unsafe-inline
]
  .map(addSemicolon)
  .join(' ')
