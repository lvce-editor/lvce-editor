import * as ExtensionHostSourceControl from '../ExtensionHost/ExtensionHostSourceControl.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

// TODO when accept input is invoked multiple times, it should not lead to errors

export const name = 'Source Control'

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
  console.info('get changed files')
  const changedFiles = await ExtensionHostSourceControl.getChangedFiles()

  console.log({ changedFiles })

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

export const contentLoaded = async (state) => {
  // TODO
  // await RendererProcess.invoke(
  //   /* Viewlet.send */ 'Viewlet.send',
  //   /* id */ 'Source Control',
  //   /* method */ 'setChangedFiles',
  //   /* changedFiles */ state.changedFiles
  // )
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

export const resize = (state, dimensions) => {
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands: [],
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.inputValue !== newState.inputValue) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Source Control',
      /* method */ 'setInputValue',
      /* value */ newState.inputValue,
    ])
  }
  return changes
}
