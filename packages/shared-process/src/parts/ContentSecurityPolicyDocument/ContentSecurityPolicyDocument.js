import * as AddSemiColon from '../AddSemiColon/AddSemiColon.js'
import * as Character from '../Character/Character.js'

export const value = [
  `default-src 'none'`,
  `font-src 'self'`,
  `frame-src *`,
  `img-src 'self' https: data:`,
  `script-src 'self'`,
  `media-src 'self'`,
  `style-src 'self'`,
]
  .map(AddSemiColon.addSemicolon)
  .join(Character.Space)
