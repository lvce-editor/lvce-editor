import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as KeyCode from '../KeyCode/KeyCode.js'
import * as Logger from '../Logger/Logger.js'
import { getPlatform } from '../Platform/Platform.js'
import * as ParseKeyBindingString from '../ParseKeyBindingString/ParseKeyBindingString.js'

const toKeyBinding = (contribution) => {
  const key = ParseKeyBindingString.parseKeyBindingString(contribution.key)
  if (key === KeyCode.Unknown) {
    Logger.warn(`ignoring extension keybinding with invalid key: ${contribution.key}`)
    return undefined
  }
  return {
    key,
    command: 'ExtensionHost.executeCommand',
    args: [contribution.command, ...(contribution.args || [])],
    ...(contribution.when && { when: contribution.when }),
  }
}

export const getKeyBindings = async () => {
  const contributions = await ExtensionManagementWorker.invoke('Extensions.getKeyBindings', assetDir, getPlatform())
  if (!Array.isArray(contributions)) {
    return []
  }
  return contributions.map(toKeyBinding).filter(Boolean)
}
