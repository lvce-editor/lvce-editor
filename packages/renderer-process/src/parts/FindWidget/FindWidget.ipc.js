import * as Command from '../Command/Command.js'
import * as FindWidget from './FindWidget.js'

export const __initialize__ = () => {
  Command.register('FindWidget.create', FindWidget.create)
  Command.register('FindWidget.dispose', FindWidget.dispose)
  Command.register('FindWidget.setResults', FindWidget.setResults)
}
