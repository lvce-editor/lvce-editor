export const closeEditor = async (state, index) => {
  console.log('close', index, 'of', state.editors)
  if (state.editors.length === 1) {
    console.log('close all')
    return closeAllEditors(state)
  }
  const top = state.top
  const left = state.left
  const width = state.width
  const height = state.height
  if (index === state.activeIndex) {
    const oldActiveIndex = state.activeIndex
    const oldEditor = state.editors[index]
    state.editors.splice(index, 1)
    const newActiveIndex = index === 0 ? index : index - 1
    const id = ViewletMap.getId(oldEditor.uri)
    Viewlet.dispose(id)
    state.activeIndex = newActiveIndex
    state.focusedIndex = newActiveIndex
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
    const commands = [
      [
        /* Main.closeOneTab */ 'Main.closeOneTab',
        /* closeIndex */ oldActiveIndex,
        /* focusIndex */ newActiveIndex,
      ],
    ]
    return {
      newState: state,
      commands,
    }
  }
  const commands = [
    [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'closeOneTabOnly',
      /* closeIndex */ index,
    ],
  ]
  state.editors.splice(index, 1)
  if (index < state.activeIndex) {
    state.activeIndex--
  }
  state.focusedIndex = state.activeIndex

  // TODO just close the tab
  return {
    newState: state,
    commands,
  }
}
