import * as Command from '../Command/Command.js'
import * as Css from './Css.js'

export const __initialize__ = () => {
  Command.register('Css.setInlineStyle', Css.setInlineStyle)
}
