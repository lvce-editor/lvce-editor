import * as Command from '../Command/Command.js'
import * as Notification from './Notification.js'

export const __initialize__ = () => {
  Command.register('Notification.create', Notification.create)
  Command.register('Notification.dispose', Notification.dispose)
  Command.register('Notification.showWithOptions', Notification.showWithOptions)
  Command.register('Notification.handleClick', Notification.handleClick)
}
