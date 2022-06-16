import * as InternalCommand from '../InternalCommand/InternalCommand.js'
import * as Notification from './ExtensionHostNotification.js'

export const __initialize__ = () => {
  InternalCommand.register('Notification.show', Notification.showNotification)
  InternalCommand.register('Notification.showWithOptions', Notification.showNotificationWithOptions)
  InternalCommand.register('Notification.hide', Notification.hide)
}
