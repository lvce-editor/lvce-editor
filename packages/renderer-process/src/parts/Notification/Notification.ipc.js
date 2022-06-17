import * as Command from '../Command/Command.js'
import * as Notification from './Notification.js'

export const __initialize__ = () => {
  Command.register(991, Notification.create)
  Command.register(992, Notification.dispose)
  Command.register(993, Notification.createWithOptions)
}
