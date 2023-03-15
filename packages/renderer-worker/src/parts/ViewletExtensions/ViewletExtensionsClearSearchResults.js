import * as ViewletExtensionsHandleInput from './ViewletExtensionsHandleInput.js'

export const clearSearchResults = (state) => {
  return ViewletExtensionsHandleInput.handleInput(state, '')
}
