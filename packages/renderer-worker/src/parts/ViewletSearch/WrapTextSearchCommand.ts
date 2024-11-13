import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const wrapTextSearchCommand = (key) => {
  const fn = async (state, ...args) => {
    await TextSearchWorker.invoke(`TextSearch.${key}`, state.uid, ...args)
    const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
