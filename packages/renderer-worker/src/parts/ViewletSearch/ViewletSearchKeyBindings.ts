import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const getKeyBindings = async () => {
  const keyBindings = await TextSearchWorker.invoke('TextSearch.getKeyBindings')
  return keyBindings
}
