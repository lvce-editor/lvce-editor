import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const dismissItem = async (state) => {
  await TextSearchWorker.invoke('TextSearch.dismissItem', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
