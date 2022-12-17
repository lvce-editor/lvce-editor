const addSemicolon = (line) => {
  return line + ';'
}

exports.key = 'Content-Security-Policy'

exports.value = [
  `default-src 'none'`,
  `connect-src 'self'`,
  `script-src 'self'`,
]
  .map(addSemicolon)
  .join(' ')
