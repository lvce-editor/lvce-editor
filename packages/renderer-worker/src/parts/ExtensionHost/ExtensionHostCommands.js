import * as ExtensionHostShared from './ExtensionHostShared.js'

export const getCommands = () => {
  // TODO can use extensions that are already loaded
  return ExtensionHostShared.execute({
    method: 'ExtensionHost.getCommands',
    params: [],
  })
}

// TODO add test for this
// TODO add test for when this errors

export const executeCommand = (id) => {
  return ExtensionHostShared.executeProvider({
    event: `onCommand:${id}`,
    method: 'ExtensionHost.executeCommand',
    params: [id],
    noProviderFoundMessage: 'No command provider found',
  })
}
