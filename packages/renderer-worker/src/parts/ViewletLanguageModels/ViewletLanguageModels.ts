import * as LanguageModelsViewWorker from '../LanguageModelsViewWorker/LanguageModelsViewWorker.js'
import type { LangaugeModelsState } from './ViewletLanguageModelsTypes.ts'

export const create = (id: number): LangaugeModelsState => {
  return {
    id,
    commands: [],
  }
}

export const loadContent = async (state: LangaugeModelsState): Promise<LangaugeModelsState> => {
  const { id } = state
  await LanguageModelsViewWorker.invoke('LanguageModels.create', id)
  await LanguageModelsViewWorker.invoke('LanguageModels.loadContent', id)
  const diffResult = await LanguageModelsViewWorker.invoke('LanguageModels.diff2', id)
  const commands = await LanguageModelsViewWorker.invoke('LanguageModels.render2', id, diffResult)
  return {
    ...state,
    commands,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await LanguageModelsViewWorker.invoke('LanguageModels.saveState', state.uid)
  await LanguageModelsViewWorker.restart('LanguageModels.terminate')
  await LanguageModelsViewWorker.invoke('LanguageModels.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await LanguageModelsViewWorker.invoke('LanguageModels.loadContent', state.uid, savedState)
  const diffResult = await LanguageModelsViewWorker.invoke('LanguageModels.diff2', state.uid)
  const commands = await LanguageModelsViewWorker.invoke('LanguageModels.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
