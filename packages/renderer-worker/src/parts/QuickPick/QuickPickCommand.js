import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as Platform from '../Platform/Platform.js'

export const name = 'command'

export const getPlaceholder = () => {
  return 'Type the name of a command to run.'
}

export const helpEntries = () => {
  return [
    {
      description: 'Show And Run Commands',
      category: 'global commands',
    },
  ]
}

export const getLabel = () => {
  return ''
}

export const getNoResults = () => {
  return {
    label: 'No matching results',
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
    console.log({ extensionPicks })
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
  if (Platform.getPlatform() === 'web') {
    const builtinPicks = await getBuiltinPicks()
    return builtinPicks
  }
  const builtinPicks = await getBuiltinPicks()
  const extensionPicks = await getExtensionPicks()
  return [...builtinPicks, ...extensionPicks]
}

const selectPickBuiltin = async (item) => {
  // TODO ids should be all numbers for efficiency -> also directly can call command
  await Command.execute(item.id)
}

const selectPickExtension = async (item) => {
  const id = item.id.slice(4) // TODO lots of string allocation with 'ext.' find a better way to separate builtin commands from extension commands
  try {
    await ExtensionHostCommands.executeCommand(id)
  } catch (error) {
    await ErrorHandling.showErrorDialog(error)
  }
}

export const selectPick = async (item) => {
  if (item.id.startsWith('ext.')) {
    await selectPickExtension(item)
  } else {
    await selectPickBuiltin(item)
  }
  return {
    command: 'hide',
  }
}

export const getFilterValue = (value) => {
  return value
}
