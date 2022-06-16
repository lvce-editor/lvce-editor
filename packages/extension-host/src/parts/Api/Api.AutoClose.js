export const state = {
  autoCloseProviders: Object.create(null),
}

export const registerAutoCloseProvider = (autoCloseProvider) => {
  // TODO have wrapper functions for these
  state.autoCloseProviders[autoCloseProvider.languageId] ||= []
  state.autoCloseProviders[autoCloseProvider.languageId].push(autoCloseProvider)
}

export const unregisterAutoCloseProvider = (autoCloseProvider) => {
  delete state.autoCloseProviders[autoCloseProvider.languageId]
}
