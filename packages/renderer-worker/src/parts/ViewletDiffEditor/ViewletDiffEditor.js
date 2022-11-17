import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Diff from '../Diff/Diff.js'

export const create = (id, uri) => {
  return {
    uri,
    linesLeft: [],
    linesRight: [],
    changes: [],
  }
}

const getContents = (left, right) => {
  return Promise.all([FileSystem.readFile(left), FileSystem.readFile(right)])
}

export const loadContent = async (state) => {
  const { uri } = state
  const uriContentPart = uri.slice('diff://'.length)
  const [left, right] = uriContentPart.split('<->')
  const [contentLeft, contentRight] = await getContents(left, right)
  const linesLeft = contentLeft.split('\n')
  const linesRight = contentRight.split('\n')
  const changes = Diff.diff(linesLeft, linesRight)
  console.log({ changes, linesLeft, linesRight })
  // TODO compute diff
  return {
    ...state,
    linesLeft,
    linesRight,
    changes,
  }
}

export const hasFunctionalRender = true

const renderLeft = {
  isEqual(oldState, newState) {
    return oldState.linesLeft === newState.linesLeft
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setContentLeft',
      /* linesLeft */ newState.linesLeft,
    ]
  },
}

const renderRight = {
  isEqual(oldState, newState) {
    return oldState.linesRight === newState.linesRight
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setContentRight',
      /* linesRight */ newState.linesRight,
    ]
  },
}

const renderChanges = {
  isEqual(oldState, newState) {
    return oldState.changes === newState.changes
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setChanges',
      /* contentLeft */ newState.changes,
    ]
  },
}

export const render = [renderLeft, renderRight, renderChanges]
