const Character = require('../Character/Character.js')
const AddSemiColon = require('../AddSemiColon/AddSemiColon.js')

exports.key = 'Content-Security-Policy'

// prettier-ignore
exports.value = [
  `default-src 'none'`,
  `connect-src 'self'`,
  `script-src 'self'`,
  `font-src 'self'`,
]
  .map(AddSemiColon.  addSemicolon)
  .join(Character.Space)
