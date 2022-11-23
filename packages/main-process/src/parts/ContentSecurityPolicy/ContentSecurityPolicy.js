const addSemicolon = (line) => {
  return line + ';'
}

exports.key = 'Content-Security-Policy'

exports.value = [
  `default-src 'none'`,
  `connect-src 'self'`,
  `font-src 'self'`,
  `frame-src *`,
  `img-src 'self' https: data:`,
  `script-src 'self'`,
  `media-src 'self'`,
  `prefetch-src 'self'`,
  `style-src 'self' 'unsafe-inline'`, // TODO remove unsafe-inline
]
  .map(addSemicolon)
  .join(' ')
