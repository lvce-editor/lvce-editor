import * as Command from '../Command/Command.js'
import * as Notification from './Notification.js'

export const __initialize__ = () => {
  Command.register(900, Notification.create)
  Command.register(901, Notification.dispose)
  Command.register(902, Notification.showWithOptions)
  Command.register(903, Notification.handleClick)
}
