import * as TextSearchViewWorker from '../TextSearchViewWorker/TextSearchViewWorker.js'

export const wrapTextSearchCommand = (key) => {
  const fn = async (state, ...args) => {
    await TextSearchViewWorker.invoke(`TextSearch.${key}`, state.uid, ...args)
    const diffResult = await TextSearchViewWorker.invoke(`TextSearch.diff2`, state.uid, ...args)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await TextSearchViewWorker.invoke('TextSearch.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
