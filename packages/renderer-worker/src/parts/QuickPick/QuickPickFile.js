import * as Command from '../Command/Command.js'
import * as Languages from '../Languages/Languages.js'
import * as SearchFile from '../SearchFile/SearchFile.js'
import * as Workspace from '../Workspace/Workspace.js'

const searchFile = async (path, value) => {
  const files = await SearchFile.searchFile(
    /* path */ path,
    /* searchTerm */ value
  )
  return files
}

const openUri = (path) => {
  return Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ path)
}

const toPick = (file) => {
  return {
    label: file,
    dataset: {
      // TODO compute language id lazily on demand inside renderer process (don't compute for hidden items)
      languageId: Languages.getLanguageId(file),
    },
  }
}

export const name = 'file'

export const getPlaceholder = () => {
  return ''
}

export const getLabel = () => {
  return 'Files'
}

// TODO help entries should not be here
export const getHelpEntries = () => {
  return [
    {
      description: 'Go to file',
      category: 'global commands',
    },
  ]
}

export const getNoResults = () => {
  return {
    label: 'No matching results',
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
  await openUri(absolutePath)
  return {
    command: 'hide',
  }
}

export const getFilterValue = (value) => {
  return value
}
