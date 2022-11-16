import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri) => {
  return {
    uri,
    contentLeft: '',
    contentRight: '',
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

  console.log({ contentLeft, contentRight })
  // TODO compute diff
  return {
    ...state,
    contentLeft,
    contentRight,
  }
}

export const hasFunctionalRender = true

const renderLeft = {
  isEqual(oldState, newState) {
    return oldState.contentLeft === newState.contentLeft
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setContentLeft',
      /* contentLeft */ newState.contentLeft,
    ]
  },
}

const renderRight = {
  isEqual(oldState, newState) {
    return oldState.contentLeft === newState.contentLeft
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setContentRight',
      /* contentLeft */ newState.contentRight,
    ]
  },
}

export const render = [renderLeft, renderRight]
