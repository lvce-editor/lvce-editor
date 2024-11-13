import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const focusNext = async (state) => {
  await TextSearchWorker.invoke('TextSearch.focusNext', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
