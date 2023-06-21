const Character = require('../Character/Character.js')
const AddSemiColon = require('../AddSemiColon/AddSemiColon.js')

exports.key = 'Content-Security-Policy'

exports.value = [
  `default-src 'none'`,
  `font-src 'self'`,
  `frame-src *`,
  `img-src 'self' https: data:`,
  `script-src 'self'`,
  `media-src 'self'`,
  `style-src 'self' 'unsafe-inline'`, // TODO remove unsafe-inline
]
  .map(AddSemiColon.addSemicolon)
  .join(Character.Space)
