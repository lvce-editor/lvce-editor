import * as Viewlet from '../Viewlet/Viewlet.js'
import { closeAllEditors } from './ViewletMainCloseAllEditors.js'

export const closeEditor = (state, index) => {
  const { groups, activeGroupIndex } = state
  if (groups.length === 0) {
    return {
      newState: state,
      commands: [],
    }
  }
  const group = groups[activeGroupIndex]
  if (group.editors.length === 1) {
    return closeAllEditors(state)
  }
  const y = group.y
  const x = group.x
  const width = group.width
  const height = group.height
  if (index === group.activeIndex) {
    const oldEditor = group.editors[index]
    const editors = group.editors
    const newEditors = [...editors.slice(0, index), ...editors.slice(index + 1)]
    const newActiveIndex = index === 0 ? index : index - 1
    const uid = oldEditor.uid
    const commands = [...Viewlet.disposeFunctional(uid)]
    // const instance = Viewlet.create(id, 'uri', left, top, width, height)
    // TODO ideally content would load synchronously and there would be one layout and one paint for opening the new tab
    // except in the case where the content takes long (>100ms) to load, then it should show the tab
    // and for the content a loading spinner or (preferred) a progress bar
    // that it replaced with the actual content once it has been loaded
    // await instance.factory.refresh(instance.state, {
    //   uri: previousEditor.uri,
    //   top: instance.state.top,
    //   left: instance.state.left,
    //   height: instance.state.height,
    //   columnWidth: COLUMN_WIDTH,
    // })
    const newGroup = { ...group, editors: newEditors, activeIndex: newActiveIndex }
    const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
    return {
      newState: {
        ...state,
        groups: newGroups,
      },
      commands,
    }
  }
  const editors = group.editors
  const newEditors = [...editors.slice(0, index), ...editors.slice(index + 1)]
  let newActiveIndex = group.activeIndex
  if (index < newActiveIndex) {
    newActiveIndex--
  }
  const newGroup = { ...group, editors: newEditors, activeIndex: newActiveIndex }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  return {
    newState: {
      ...state,
      groups: newGroups,
    },
    commands: [],
  }
}
