import type { LangaugeModelsState } from './ViewletLanguageModelsTypes.ts'
import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as LanguageModelsViewWorker from '../LanguageModelsViewWorker/LanguageModelsViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const renderDialog = {
  isEqual(oldState: LangaugeModelsState, newState: LangaugeModelsState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDialog]

export const renderEventListeners = async () => {
  const listeners = await LanguageModelsViewWorker.invoke('LanguageModels.renderEventListeners')
  return listeners
}
