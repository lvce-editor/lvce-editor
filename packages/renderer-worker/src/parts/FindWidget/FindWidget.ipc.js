import * as Command from '../Command/Command.js'
import * as FindWidget from './FindWidget.js'

export const __initialize__ = () => {
  Command.register(212333, FindWidget.create)
  Command.register(212334, FindWidget.dispose)
  Command.register(4101, FindWidget.setValue)
  Command.register(4102, FindWidget.dispose)
}
