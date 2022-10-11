const addSemicolon = (line) => {
  return line + ';'
}

exports.key = 'Content-Security-Policy'

exports.value = [
  `default-src 'none'`,
  `img-src 'self' https: data:`,
  `media-src 'none'`,
  `script-src 'self' 'unsafe-inline'`, // TODO remove unsafe-inline
  `style-src 'self' 'unsafe-inline'`, // TODO remove unsafe-inline
  `font-src 'self' https:`,
  `frame-src *`,
  `connect-src self`,
]
  .map(addSemicolon)
  .join(' ')
