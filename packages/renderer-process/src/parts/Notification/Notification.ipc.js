import * as Notification from './Notification.js'

export const name = 'Notification'

// prettier-ignore
export const Commands =  {
  create: Notification.create,
  createWithOptions: Notification.createWithOptions,
  dispose: Notification.dispose,
}
