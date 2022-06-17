import * as Command from '../Command/Command.js'
import * as FindWidget from './FindWidget.js'

export const __initialize__ = () => {
  Command.register(4100, FindWidget.create)
  Command.register(4102, FindWidget.dispose)
  Command.register(4103, FindWidget.setResults)
}
