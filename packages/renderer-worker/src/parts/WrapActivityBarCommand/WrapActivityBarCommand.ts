import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'

const clickQueues = new Map<number, Promise<void>>()

const isClickCommand = (key: string): boolean => {
  return key === 'handleClick' || key === 'handleClickIndex'
}

const runActivityBarCommand = async (key: string, state, args) => {
  if (key === 'handleFocus') {
    Focus.setFocus(FocusKey.ActivityBar)
  } else if (key === 'handleBlur') {
    Focus.clearFocus(FocusKey.ActivityBar)
  }
  await ActivityBarWorker.invoke(`ActivityBar.${key}`, state.uid, ...args)
  const diffResult = await ActivityBarWorker.invoke('ActivityBar.diff2', state.uid)
  if (diffResult.length === 0) {
    return state
  }
  const commands = await ActivityBarWorker.invoke('ActivityBar.render2', state.uid, diffResult)
  if (commands.length === 0) {
    return state
  }
  return {
    ...state,
    commands,
  }
}

export const wrapActivityBarCommand = (key: string) => {
  return async (state, ...args) => {
    if (!isClickCommand(key)) {
      return runActivityBarCommand(key, state, args)
    }
    const previous = clickQueues.get(state.uid)
    const { promise: next, resolve } = Promise.withResolvers<void>()
    clickQueues.set(state.uid, next)
    if (previous) {
      await previous
    }
    try {
      return await runActivityBarCommand(key, state, args)
    } finally {
      resolve()
      if (clickQueues.get(state.uid) === next) {
        clickQueues.delete(state.uid)
      }
    }
  }
}
