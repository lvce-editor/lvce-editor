import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const getCommands = async () => {
  // TODO can use extensions that are already loaded
  return await ExtensionHost.invoke(
    /* ExtensionHost.getCommands */ 'ExtensionHost.getCommands'
  )
}

// TODO add test for this
// TODO add test for when this errors

export const executeCommand = async (id) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onCommand:${id}`
  )
  await extensionHost.invoke(
    /* ipc */ extensionHost,
    /* extensionHost.executeCommandFromQuickPick */ 'ExtensionHost.executeCommand',
    /* id */ id
  )
}
