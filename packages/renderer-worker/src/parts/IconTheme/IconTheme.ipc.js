import * as Command from '../Command/Command.js'
import * as IconTheme from './IconTheme.js'

export const __initialize__ = () => {
  // TODO command necessary?
  Command.register(3030, IconTheme.getIconThemeCss)
  // TODO hydrate should be an alias for reload/load
  Command.register(3031, IconTheme.hydrate)
  Command.register(3032, IconTheme.addIcons)
}
