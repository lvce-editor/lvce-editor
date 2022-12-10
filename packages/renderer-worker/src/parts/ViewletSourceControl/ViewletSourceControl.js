import * as FileSystem from '../FileSystem/FileSystem.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
// TODO when accept input is invoked multiple times, it should not lead to errors

export const create = () => {
  return {
    merge: [],
    index: [],
    untracked: [],
    workingTree: [],
    disposed: false,
    inputValue: '',
    displayItems: [],
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const acceptInput = async (state, text) => {
  state.inputValue = text // TODO avoid side effect here
  await SourceControl.acceptInput(text)
  return {
    ...state,
    inputValue: '',
  }
}

const getChangedFiles = async () => {
  const changedFiles = await SourceControl.getChangedFiles()
  return {
    index: [],
    merge: [],
    untracked: [],
    workingTree: changedFiles,
    gitRoot: '',
  }
}

const getDisplayItems = (workingTree) => {
  const displayItems = []
  const setSize = workingTree.length
  for (let i = 0; i < workingTree.length; i++) {
    const item = workingTree[i]
    displayItems.push({
      file: item.file,
      label: item.file,
      posInSet: i + 1,
      setSize,
      icon: IconTheme.getFileIcon({ name: item.file }),
    })
  }
  return displayItems
}

export const loadContent = async (state) => {
  const changedFiles = await getChangedFiles()
  const displayItems = getDisplayItems(changedFiles.workingTree)
  return {
    ...state,
    index: changedFiles.index,
    merge: changedFiles.merge,
    untracked: changedFiles.untracked,
    workingTree: changedFiles.workingTree,
    gitRoot: changedFiles.gitRoot,
    displayItems,
  }
}

const updateIcon = (displayItem) => {
  return {
    ...displayItem,
    icon: IconTheme.getFileIcon({ name: displayItem.file }),
  }
}

export const updateIcons = (state) => {
  const { displayItems } = state
  const newDisplayItems = displayItems.map(updateIcon)
  return {
    ...state,
    displayItems: newDisplayItems,
  }
}

export const handleIconThemeChange = (state) => {
  return updateIcons(state)
}

export const handleClick = async (state, index) => {
  const item = state.workingTree[index]
  const absolutePath = `${state.gitRoot}/${item.file}`
  // TODO handle error
  const [fileBefore, fileNow] = await Promise.all([
    SourceControl.getFileBefore(item.file),
    FileSystem.readFile(absolutePath),
  ])
  const content = `before:\n${fileBefore}\n\n\nnow:\n${fileNow}`
  // const content
  // await Main.openRawText(`diff://${absolutePath}`, content, 'plaintext')
  // await Main.openAbsolutePath(absolutePath)
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.inputValue === newState.inputValue
  },
  apply(oldState, newState) {
    return [/* method */ 'setInputValue', /* value */ newState.inputValue]
  },
}

const renderChangedFiles = {
  isEqual(oldState, newState) {
    return oldState.displayItems === newState.displayItems
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setChangedFiles',
      /* changedFiles */ newState.displayItems,
    ]
  },
}

export const render = [renderValue, renderChangedFiles]
