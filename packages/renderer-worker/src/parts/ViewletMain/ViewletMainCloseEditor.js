import * as Viewlet from '../Viewlet/Viewlet.js'
import { closeAllEditors } from './ViewletMainCloseAllEditors.js'

export const closeEditor = (state, index) => {
  if (state.editors.length === 0) {
    return {
      newState: state,
      commands: [],
    }
  }
  if (state.editors.length === 1) {
    return closeAllEditors(state)
  }
  const y = state.y
  const x = state.x
  const width = state.width
  const height = state.height
  if (index === state.activeIndex) {
    const oldEditor = state.editors[index]
    const editors = state.editors
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
    return {
      newState: {
        ...state,
        activeIndex: newActiveIndex,
        focusedIndex: newActiveIndex,
        editors: newEditors,
      },
      commands,
    }
  }
  const editors = state.editors
  const newEditors = [...editors.slice(0, index), ...editors.slice(index + 1)]
  let newActiveIndex = state.activeIndex
  if (index < newActiveIndex) {
    newActiveIndex--
  }
  const newFocusedIndex = newActiveIndex
  // TODO just close the tab
  return {
    newState: {
      ...state,
      editors: newEditors,
      focusedIndex: newFocusedIndex,
      activeIndex: newActiveIndex,
    },
    commands: [],
  }
}
