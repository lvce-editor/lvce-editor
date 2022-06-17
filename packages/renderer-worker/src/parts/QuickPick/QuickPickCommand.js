import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as Platform from '../Platform/Platform.js'

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
    /* Ajax.getJson */ 270,
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
  // TODO don't call this every time
  const extensionPicks = await ExtensionHostCommands.getCommands()
  const mappedPicks = extensionPicks.map(prefixIdWithExt)
  return mappedPicks
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
  const id = await Command.execute(
    /* CommandInfo.getCommandInfo */ 1592,
    /* id */ item.id
  )
  await Command.execute(id)
  console.log('execute', id)
}

const selectPickExtension = async (item) => {
  console.log('ext pick', item)
  const id = item.id.slice(4) // TODO lots of string allocation with 'ext.' find a better way to separate builtin commands from extension commands
  try {
    await ExtensionHostCommands.executeCommand(id)
  } catch (error) {
    ErrorHandling.showErrorDialog(error)
    // console.log({ error })
    // console.error(error)
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
