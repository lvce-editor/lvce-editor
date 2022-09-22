import * as Command from '../Command/Command.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as SearchFile from '../SearchFile/SearchFile.js'
import * as Workspace from '../Workspace/Workspace.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Files: 'Files',
  NoMatchingResults: 'No matching results',
  GoToFile: 'Go to file',
}

const searchFile = async (path, value) => {
  const files = await SearchFile.searchFile(
    /* path */ path,
    /* searchTerm */ value
  )
  return files
}

const getIcon = (file) => {
  const baseName = Workspace.pathBaseName(file)
  return IconTheme.getFileIcon({ name: baseName })
}

const toPick = (file) => {
  const icon = getIcon(file)
  return {
    label: file,
    icon,
  }
}

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
  const picks = files.map(toPick)
  return picks
}

export const selectPick = async (item) => {
  const workspace = Workspace.state.workspacePath
  const absolutePath = `${workspace}/${item.label}`
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ absolutePath
  )
  return {
    command: 'hide',
  }
}

export const getFilterValue = (value) => {
  return value
}
