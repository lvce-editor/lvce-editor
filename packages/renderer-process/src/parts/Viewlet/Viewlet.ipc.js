import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const __initialize__ = () => {
  Command.register(3022, Viewlet.refresh)
  Command.register(3024, Viewlet.invoke)
  Command.register(3027, Viewlet.focus)
  Command.register(3026, Viewlet.dispose)
  // Command.register(3028, Viewlet.hydrate)
  Command.register(3029, Viewlet.appendViewlet)
  Command.register(3030, Viewlet.load)
  Command.register(3031, Viewlet.handleError)
  Command.register(3032, Viewlet.sendMultiple)
}
