import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const focusFirst = async (state) => {
  await TextSearchWorker.invoke('TextSearch.focusFirst', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
