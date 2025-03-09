import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderItems = {
  isEqual(oldState, newState) {
    return newState.commands.length === 0
  },
  apply(oldState, newState) {
    const commands = newState.commands
    // @ts-ignore
    newState.commands = []
    return commands
  },
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async () => {
  const listeners = await TitleBarWorker.invoke('TitleBar.renderEventListeners')
  return listeners
}
