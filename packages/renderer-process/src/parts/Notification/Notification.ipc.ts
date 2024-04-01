import * as Notification from './Notification.ts'

export const name = 'Notification'

// prettier-ignore
export const Commands = {
  create: Notification.create,
  createWithOptions: Notification.createWithOptions,
  dispose: Notification.dispose,
}
