import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const focusIndex = async (state, index) => {
  await TextSearchWorker.invoke('TextSearch.focusIndex', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
