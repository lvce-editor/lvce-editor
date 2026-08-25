import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

const commandQueues = new Map()

const runTitleBarCommand = async (key, state, args) => {
  await TitleBarWorker.invoke(`TitleBar.${key}`, state.uid, ...args)
  const diffResult = await TitleBarWorker.invoke('TitleBar.diff3', state.uid)
  if (diffResult.length === 0) {
    return state
  }
  const commands = await TitleBarWorker.invoke('TitleBar.render3', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}

export const wrapTitleBarCommand = (key) => {
  return async (state, ...args) => {
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
