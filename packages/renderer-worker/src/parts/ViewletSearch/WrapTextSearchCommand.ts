import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const wrapTextSearchCommand = (key) => {
  const fn = async (state, ...args) => {
    await TextSearchWorker.invoke(`TextSearch.${key}`, state.uid, ...args)
    const diffResult = await TextSearchWorker.invoke(`TextSearch.diff2`, state.uid, ...args)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await TextSearchWorker.invoke('TextSearch.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
