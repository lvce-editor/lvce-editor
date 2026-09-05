import * as Logger from '../Logger/Logger.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

interface Subscription {
  listener: (type: string, instance: unknown) => void
  pending: boolean
  promise: Promise<void> | undefined
}

const subscriptions = new Map<number, Subscription>()

export const unsubscribe = (uid: number): void => {
  const subscription = subscriptions.get(uid)
  if (!subscription) {
    return
  }
  subscriptions.delete(uid)
  ViewletStates.removeListener(subscription.listener)
}

export const subscribe = (uid: number): Promise<void> | undefined => {
  const instance = ViewletStates.getByUid(uid)
  if (!instance || subscriptions.has(uid)) {
    return
  }
  const subscription: Subscription = { listener: () => {}, pending: false, promise: undefined }
  const isActive = () => subscriptions.get(uid) === subscription && ViewletStates.getByUid(uid) === instance
  const refresh = () => {
    subscription.pending = true
    subscription.promise ||= Promise.resolve().then(async () => {
      try {
        while (subscription.pending && isActive()) {
          subscription.pending = false
          await Viewlet.executeViewletCommand(uid, 'refresh')
        }
      } catch (error) {
        Logger.error(error)
      } finally {
        subscription.promise = undefined
      }
    })
    return subscription.promise
  }
  subscription.listener = (type, changedInstance) => {
    if (type === 'remove' && changedInstance === instance) {
      unsubscribe(uid)
    } else if (type === 'add' || type === 'remove') {
      void refresh()
    }
  }
  subscriptions.set(uid, subscription)
  ViewletStates.addListener(subscription.listener)
  return refresh()
}
