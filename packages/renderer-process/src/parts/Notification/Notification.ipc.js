import * as Command from '../Command/Command.js'
import * as Notification from './Notification.js'
import * as CommandId from '../CommandId/CommandId.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register(CommandId.NOTIFICATION_CREATE, Notification.create)
  Command.register(CommandId.NOTIFICATION_DISPOSE, Notification.dispose)
  Command.register(CommandId.NOTIFICATION_CREATE_WITH_OPTIONS, Notification.createWithOptions)
}
