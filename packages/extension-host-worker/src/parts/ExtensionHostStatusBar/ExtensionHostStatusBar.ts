import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'

export const getStatusBarItems = async () => {
  const providers = Object.values(ExtensionHostSourceControl.state.providers)
  const statusBarItems = []
  for (const provider of providers) {
    // @ts-ignore
    if (provider && provider.statusBarCommands) {
      // @ts-ignore
      statusBarItems.push(...provider.statusBarCommands)
    }
  }
  return statusBarItems
}

export const registerChangeListener = () => {
  // TODO
}
