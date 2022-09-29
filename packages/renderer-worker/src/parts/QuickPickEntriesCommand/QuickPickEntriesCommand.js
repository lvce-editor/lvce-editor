import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  TypeNameOfCommandToRun: 'Type the name of a command to run.',
  ShowAndRunCommands: 'Show And Run Commands',
  NoMatchingResults: 'No matching results',
}

export const name = 'command'

export const getPlaceholder = () => {
  return UiStrings.TypeNameOfCommandToRun
}

export const helpEntries = () => {
  return [
    {
      description: UiStrings.ShowAndRunCommands,
      category: 'global commands',
    },
  ]
}

export const getLabel = () => {
  return ''
}

export const getNoResults = () => {
  return {
    label: UiStrings.NoMatchingResults,
  }
}

// TODO combine Ajax with cache (specify strategy: cacheFirst, networkFirst)
const getBuiltinPicks = async () => {
  const assetDir = Platform.getAssetDir()
  const url = `${assetDir}/config/builtinCommands.json`
  const builtinPicks = await Command.execute(
    /* Ajax.getJson */ 'Ajax.getJson',
    /* url */ url
  )
  return builtinPicks
}

const prefixIdWithExt = (item) => {
  if (!item.label) {
    ErrorHandling.warn('[QuickPick] item has missing label', item)
  }
  if (!item.id) {
    ErrorHandling.warn('[QuickPick] item has missing id', item)
  }
  return {
    ...item,
    id: `ext.${item.id}`,
    label: item.label || item.id,
  }
}

const getExtensionPicks = async () => {
  try {
    // TODO don't call this every time
    const extensionPicks = await ExtensionHostCommands.getCommands()
    if (!extensionPicks) {
      return []
    }
    const mappedPicks = extensionPicks.map(prefixIdWithExt)
    return mappedPicks
  } catch (error) {
    console.error(`Failed to get extension picks: ${error}`)
    return []
  }
}

// TODO send strings to renderer process only once for next occurrence send uint16array of ids of strings

export const getPicks = async () => {
  if (Platform.platform === PlatformType.Web) {
    const builtinPicks = await getBuiltinPicks()
    return builtinPicks
  }
  const builtinPicks = await getBuiltinPicks()
  const extensionPicks = await getExtensionPicks()
  return [...builtinPicks, ...extensionPicks]
}

const shouldHide = (item) => {
  if (item.id === 'Viewlet.openWidget' && item.args[0] === 'QuickPick') {
    return false
  }
  return true
}

const selectPickBuiltin = async (item) => {
  const args = item.args || []
  // TODO ids should be all numbers for efficiency -> also directly can call command
  await Command.execute(item.id, ...args)
  if (shouldHide(item)) {
    return {
      command: 'hide',
    }
  }
  return {
    command: '',
  }
}

const selectPickExtension = async (item) => {
  const id = item.id.slice(4) // TODO lots of string allocation with 'ext.' find a better way to separate builtin commands from extension commands
  try {
    await ExtensionHostCommands.executeCommand(id)
  } catch (error) {
    await ErrorHandling.showErrorDialog(error)
  }
  return {
    command: 'hide',
  }
}

export const selectPick = (item) => {
  if (item.id.startsWith('ext.')) {
    return selectPickExtension(item)
  }
  return selectPickBuiltin(item)
}

export const getFilterValue = (value) => {
  return value
}
