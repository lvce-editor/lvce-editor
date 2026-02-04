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
  await LanguageModelsViewWorker.invoke('LanguageModels.loadContent2', id)
  const diffResult = await LanguageModelsViewWorker.invoke('LanguageModels.diff2', id)
  const commands = await LanguageModelsViewWorker.invoke('LanguageModels.render2', id, diffResult)
  return {
    ...state,
    commands,
  }
}
