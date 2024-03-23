import * as Character from '../Character/Character.js'
import * as AddSemiColon from '../AddSemiColon/AddSemiColon.js'

export const key = 'Content-Security-Policy'

export const value = [`default-src 'none'`, `script-src 'self'`].map(AddSemiColon.addSemicolon).join(Character.Space)
