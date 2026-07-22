import * as TextSearchViewWorker from '../TextSearchViewWorker/TextSearchViewWorker.js'

export const getKeyBindings = async () => {
  const keyBindings = await TextSearchViewWorker.invoke('TextSearch.getKeyBindings')
  return keyBindings
}
