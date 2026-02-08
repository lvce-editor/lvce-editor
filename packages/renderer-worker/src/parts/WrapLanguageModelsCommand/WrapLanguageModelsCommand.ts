import * as LanguageModelsViewWorker from '../LanguageModelsViewWorker/LanguageModelsViewWorker.js'

export const wrapLanguageModelsCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await LanguageModelsViewWorker.invoke(`LanguageModels.${key}`, state.id, ...args)
    const diffResult = await LanguageModelsViewWorker.invoke(`LanguageModels.diff2`, state.id)
    const commands = await LanguageModelsViewWorker.invoke('LanguageModels.render2', state.id, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
    }
  }
  return fn
}
