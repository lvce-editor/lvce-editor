import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const focusLast = async (state) => {
  await TextSearchWorker.invoke('TextSearch.focusLast', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
