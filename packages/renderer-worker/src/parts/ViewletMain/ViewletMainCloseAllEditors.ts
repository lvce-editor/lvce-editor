import * as Viewlet from '../Viewlet/Viewlet.js'
import type { MainState } from './ViewletMainTypes.ts'

const getUid = (editor) => {
  return editor.uid
}

const getEditors = (group) => {
  return group.editors
}

export const closeAllEditors = (state: MainState) => {
  // @ts-ignore
  const { groups, uid } = state
  const editors = groups.flatMap(getEditors)
  const ids = editors.map(getUid)
  const commands = [['Viewlet.send', uid, 'dispose'], ...ids.flatMap(Viewlet.disposeFunctional)]
  return {
    newState: {
      ...state,
      groups: [],
      activeGroupIndex: -1,
    },
    commands,
  }
}
