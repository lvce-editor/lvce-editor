import * as Command from '../Command/Command.js'
import * as Widget from './Widget.js'

export const __initialize__ = () => {
  Command.register('Widget.openWidget', Widget.openWidget)
}
