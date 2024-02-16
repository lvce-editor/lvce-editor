import * as Command from '../Command/Command.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'
import * as SearchFile from '../SearchFile/SearchFile.js'
import * as ViewletQuickPickStrings from '../ViewletQuickPick/ViewletQuickPickStrings.js'
import * as Workspace from '../Workspace/Workspace.js'

const searchFile = async (path, value) => {
  const files = await SearchFile.searchFile(/* path */ path, /* searchTerm */ value)
  return files
}

export const name = 'file'

export const getPlaceholder = () => {
  return ''
}

export const getLabel = () => {
  return ViewletQuickPickStrings.files()
}

// TODO help entries should not be here
export const getHelpEntries = () => {
  return [
    {
      description: ViewletQuickPickStrings.goToFile(),
      category: 'global commands',
    },
  ]
}

export const getNoResults = () => {
  return {
    label: ViewletQuickPickStrings.noMatchingResults(),
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
  const baseName = Workspace.pathBaseName(pick)
  return baseName
}

export const getPickDescription = (pick) => {
  const dirName = Workspace.pathDirName(pick)
  return dirName
}

export const getPickIcon = () => {
  return ''
}

export const getPickFileIcon = (pick) => {
  const baseName = Workspace.pathBaseName(pick)
  return IconTheme.getFileIcon({ name: baseName })
}
