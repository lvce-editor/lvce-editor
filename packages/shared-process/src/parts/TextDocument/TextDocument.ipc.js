import * as Command from '../Command/Command.js'
import * as TextDocument from './TextDocument.js'

export const __initialize__ = () => {
 Command.register(4820, TextDocument.applyEdit)
}
