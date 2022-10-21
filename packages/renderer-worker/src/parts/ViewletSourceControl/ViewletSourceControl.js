import * as ExtensionHostSourceControl from '../ExtensionHost/ExtensionHostSourceControl.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

// TODO when accept input is invoked multiple times, it should not lead to errors

export const name = ViewletModuleId.SourceControl

export const create = () => {
  return {
    merge: [],
    index: [],
    untracked: [],
    workingTree: [],
    disposed: false,
    inputValue: '',
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
  await ExtensionHostSourceControl.acceptInput(text)
  return {
    ...state,
    inputValue: '',
  }
}

const getChangedFiles = async () => {
  const changedFiles = await ExtensionHostSourceControl.getChangedFiles()
  return {
    index: [],
    merge: [],
    untracked: [],
    workingTree: changedFiles,
    gitRoot: '',
  }
}

export const loadContent = async (state) => {
  const changedFiles = await getChangedFiles()
  return {
    ...state,
    index: changedFiles.index,
    merge: changedFiles.merge,
    untracked: changedFiles.untracked,
    workingTree: changedFiles.workingTree,
    gitRoot: changedFiles.gitRoot,
  }
}

export const handleClick = async (state, index) => {
  const item = state.workingTree[index]
  const absolutePath = `${state.gitRoot}/${item.file}`
  // TODO handle error
  const [fileBefore, fileNow] = await Promise.all([
    ExtensionHostSourceControl.getFileBefore(item.file),
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
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Source Control',
      /* method */ 'setInputValue',
      /* value */ newState.inputValue,
    ]
  },
}

const renderChangeFiles = {
  isEqual(oldState, newState) {
    return oldState.workingTree === newState.workingTree
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Source Control',
      /* method */ 'setChangedFiles',
      /* changedFiles */ newState.workingTree,
    ]
  },
}

export const render = [renderValue, renderChangeFiles]
