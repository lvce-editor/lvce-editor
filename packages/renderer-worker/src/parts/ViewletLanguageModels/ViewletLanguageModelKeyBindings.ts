import * as LanguageModelsViewWorker from '../LanguageModelsViewWorker/LanguageModelsViewWorker.js'

export const getKeyBindings = () => {
  return LanguageModelsViewWorker.invoke('LanguageModels.getKeyBindings')
}
