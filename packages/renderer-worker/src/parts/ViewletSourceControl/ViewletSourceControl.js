import * as FileSystem from '../FileSystem/FileSystem.js'
import * as SourceControl from '../SourceControl/SourceControl.js'

// TODO when accept input is invoked multiple times, it should not lead to errors

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

const renderChangeFiles = {
  isEqual(oldState, newState) {
    return oldState.workingTree === newState.workingTree
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setChangedFiles',
      /* changedFiles */ newState.workingTree,
    ]
  },
}

export const render = [renderValue, renderChangeFiles]
