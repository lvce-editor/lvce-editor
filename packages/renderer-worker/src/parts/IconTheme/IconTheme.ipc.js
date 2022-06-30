import * as Command from '../Command/Command.js'
import * as IconTheme from './IconTheme.js'

export const __initialize__ = () => {
  // TODO command necessary?
  Command.register('IconTheme.getIconThemeCss', IconTheme.getIconThemeCss)
  // TODO hydrate should be an alias for reload/load
  Command.register('IconTheme.hydrate', IconTheme.hydrate)
  Command.register('IconTheme.addIcons', IconTheme.addIcons)
}
