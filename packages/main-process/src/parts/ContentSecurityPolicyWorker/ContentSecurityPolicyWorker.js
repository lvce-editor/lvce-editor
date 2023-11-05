import * as Character from '../Character/Character.js'
import * as AddSemiColon from '../AddSemiColon/AddSemiColon.js'

export const key = 'Content-Security-Policy'

// prettier-ignore
export const value = [
  `default-src 'none'`,
  `connect-src 'self'`,
  `script-src 'self'`,
  `font-src 'self'`,
]
  .map(AddSemiColon.addSemicolon)
  .join(Character.Space)
