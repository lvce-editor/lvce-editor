import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const state = {
  notifications: [],
}

export const create = async (type, text) => {
  state.notifications.push({ type, text })
  const commands = [
    ['Viewlet.load', ViewletModuleId.Notification],
    ['Viewlet.create', ViewletModuleId.Notification],
    ['Viewlet.send', ViewletModuleId.Notification, 'setType', type],
    ['Viewlet.send', ViewletModuleId.Notification, 'setText', text],
    ['Viewlet.appendToBody', ViewletModuleId.Notification],
  ]
  for (const command of commands) {
    await RendererProcess.invoke(...command)
  }
}

export const showWithOptions = async (type, text, options) => {
  state.notifications.push({ type, text, options })
  console.log({ type, text, options })
  await RendererProcess.invoke(
    /* Notification.createWithOptions */ 993,
    /* type */ type,
    /* text */ text,
    /* options */ options
  )
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
  await RendererProcess.invoke(
    /* Notification.dispose */ 'Notification.dispose',
    /* id */ id
  )
}
