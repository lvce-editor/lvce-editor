import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import * as TitleBarMenuOverlay from './TitleBarMenuOverlay.js'

const commandQueues = new Map()

const runTitleBarCommand = async (key, state, args) => {
  const wasTitleBarMenuOpen = state.titleBarMenuOpen === true
  await TitleBarWorker.invoke(`TitleBar.${key}`, state.uid, ...args)
  const titleBarState = await TitleBarWorker.invoke('TitleBar.getComponentState', state.uid)
  const isTitleBarMenuOpen = titleBarState.isMenuOpen === true
  if (!wasTitleBarMenuOpen && isTitleBarMenuOpen) {
    await TitleBarMenuOverlay.show()
  }
  const diffResult = await TitleBarWorker.invoke('TitleBar.diff3', state.uid)
  if (diffResult.length === 0) {
    return {
      ...state,
      titleBarMenuOpen: isTitleBarMenuOpen,
    }
  }
  const commands = await TitleBarWorker.invoke('TitleBar.render3', state.uid, diffResult)
  return {
    ...state,
    titleBarMenuOpen: isTitleBarMenuOpen,
    commands,
  }
}

export const wrapTitleBarCommand = (key) => {
  return async (state, ...args) => {
    // Workspace actions await this notification while their menu command owns the queue.
    // Let the notification complete so the action can finish and release the queue.
    if (key === 'handleWorkspaceChange') {
      return runTitleBarCommand(key, state, args)
    }
    const previous = commandQueues.get(state.uid)
    const { promise: next, resolve } = Promise.withResolvers()
    commandQueues.set(state.uid, next)
    if (previous) {
      await previous
    }
    try {
      return await runTitleBarCommand(key, state, args)
    } finally {
      resolve(undefined)
      if (commandQueues.get(state.uid) === next) {
        commandQueues.delete(state.uid)
      }
    }
  }
}
