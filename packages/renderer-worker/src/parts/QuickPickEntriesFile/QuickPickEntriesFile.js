import * as Command from '../Command/Command.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as SearchFile from '../SearchFile/SearchFile.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Files: 'Files',
  NoMatchingResults: 'No matching results',
  GoToFile: 'Go to file',
}

const searchFile = async (path, value) => {
  const files = await SearchFile.searchFile(/* path */ path, /* searchTerm */ value)
  return files
}

const getIcon = (file) => {}

export const name = 'file'

export const getPlaceholder = () => {
  return ''
}

export const getLabel = () => {
  return UiStrings.Files
}

// TODO help entries should not be here
export const getHelpEntries = () => {
  return [
    {
      description: UiStrings.GoToFile,
      category: 'global commands',
    },
  ]
}

export const getNoResults = () => {
  return {
    label: UiStrings.NoMatchingResults,
  }
}

export const getPicks = async (searchValue) => {
  const workspace = Workspace.state.workspacePath
  if (!workspace) {
    return []
  }
  const files = await searchFile(workspace, searchValue)
  // const picks = files.map(toPick)
  return files
}

export const selectPick = async (pick) => {
  const workspace = Workspace.state.workspacePath
  const absolutePath = `${workspace}/${pick}`
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ absolutePath)
  return {
    command: QuickPickReturnValue.Hide,
  }
}

export const getFilterValue = (value) => {
  return value
}

export const getPickFilterValue = (pick) => {
  return pick
}

export const getPickLabel = (pick) => {
  return pick
}

export const getPickIcon = (pick) => {
  const baseName = Workspace.pathBaseName(pick)
  return IconTheme.getFileIcon({ name: baseName })
}
