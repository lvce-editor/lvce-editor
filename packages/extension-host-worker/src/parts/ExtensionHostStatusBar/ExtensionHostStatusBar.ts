import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'

export const getStatusBarItems = async () => {
  const providers = Object.values(ExtensionHostSourceControl.state.providers)
  const statusBarItems = []
  for (const provider of providers) {
    if (provider && provider.statusBarCommands) {
      statusBarItems.push(...provider.statusBarCommands)
    }
  }
  return statusBarItems
}

export const registerChangeListener = () => {
  // TODO
}
