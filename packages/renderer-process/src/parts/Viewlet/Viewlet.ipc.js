import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const __initialize__ = () => {
  Command.register('Viewlet.refresh', Viewlet.refresh)
  Command.register('Viewlet.invoke', Viewlet.invoke)
  Command.register('Viewlet.focus', Viewlet.focus)
  Command.register('Viewlet.dispose', Viewlet.dispose)
  // Command.register(3028, Viewlet.hydrate)
  Command.register('Viewlet.appendViewlet', Viewlet.appendViewlet)
  Command.register('Viewlet.load', Viewlet.load)
  Command.register('Viewlet.handleError', Viewlet.handleError)
  Command.register('Viewlet.sendMultiple', Viewlet.sendMultiple)
}
