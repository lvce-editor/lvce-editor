import * as Command from '../Command/Command.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(2133, Viewlet.send)
}
