import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const focusPrevious = async (state) => {
  await TextSearchWorker.invoke('TextSearch.focusPrevious', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
