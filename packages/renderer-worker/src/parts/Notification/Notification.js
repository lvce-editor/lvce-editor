import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const state = {
  notifications: [],
}

export const create = async (type, text) => {
  // @ts-ignore
  state.notifications.push({ type, text })
  return RendererProcess.invoke(/* Notification.create */ 'Notification.create', /* type */ type, /* text */ text)
}

export const showWithOptions = async (type, text, options) => {
  return RendererProcess.invoke('Notification.showWithOptions', type, text, options)
}

export const handleClick = (index) => {
  console.log('handle click')
  const notification = state.notifications[0]
  if (!notification.options) {
    throw new Error('notification has no options that can be clicked')
  }
  const option = notification.options[index]
  console.log({ notification, index, option })
}

export const dispose = async (id) => {
  await RendererProcess.invoke(/* Notification.dispose */ 'Notification.dispose', /* id */ id)
}
