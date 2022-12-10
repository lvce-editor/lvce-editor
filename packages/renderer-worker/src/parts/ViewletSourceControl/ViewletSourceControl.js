import * as FileSystem from '../FileSystem/FileSystem.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Icon from '../Icon/Icon.js'
// TODO when accept input is invoked multiple times, it should not lead to errors

/**
 * @enum {string}
 */
const UiStrings = {
  Add: 'Add',
  Restore: 'Restore',
  OpenFile: 'Open File',
}

export const create = () => {
  return {
    merge: [],
    index: [],
    untracked: [],
    workingTree: [],
    disposed: false,
    inputValue: '',
    displayItems: [],
    buttonIndex: -1,
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

export const handleMouseOver = (state, index) => {
  console.log('mouse over', state.buttonIndex, index)
  return {
    ...state,
    buttonIndex: index,
    buttons: [
      {
        label: UiStrings.OpenFile,
        icon: Icon.Close,
      },
      {
        label: UiStrings.Restore,
        icon: Icon.Close,
      },
      {
        label: UiStrings.Add,
        icon: Icon.Close,
      },
    ],
  }
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

const renderButtons = {
  isEqual(oldState, newState) {
    console.log('render buttons', oldState.buttonIndex, newState.buttonIndex)
    return (
      oldState.buttonIndex === newState.buttonIndex &&
      oldState.buttons === newState.buttons
    )
  },
  apply(oldState, newState) {
    console.log('apply')
    return [
      /* method */ 'setItemButtons',
      /* index */ newState.buttonIndex,
      /* buttons */ newState.buttons,
    ]
  },
}

export const render = [renderValue, renderChangedFiles, renderButtons]
