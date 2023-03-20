import * as Logger from '../Logger/Logger.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import { loadContent } from './ViewletSourceControlLoadContent.js'

export const acceptInput = async (state) => {
  const { inputValue, enabledProviderIds } = state
  if (enabledProviderIds.length === 0) {
    Logger.info(`[ViewletSourceControl] no source control provider found`)
    return state
  }
  const providerId = enabledProviderIds[0]
  await SourceControl.acceptInput(providerId, inputValue)
  const newState = await loadContent(state)
  return {
    ...newState,
    inputValue: '',
  }
}
