const addSemicolon = (line) => {
  return line + ';'
}

exports.contentSecurityPolicy = [
  `default-src 'none'`,
  `img-src 'self' https: data:`,
  `media-src 'none'`,
  `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' https:`,
]
  .map(addSemicolon)
  .join(' ')
