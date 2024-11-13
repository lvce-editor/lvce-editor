import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const copy = async (state) => {
  await TextSearchWorker.invoke('TextSearch.copy', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
