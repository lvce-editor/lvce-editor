export const focusIndex = async (state, index) => {
  if (index === state.activeIndex) {
    return state
  }
  const oldActiveIndex = state.activeIndex
  state.activeIndex = index

  const editor = state.editors[index]
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const id = ViewletMap.getId(editor.uri)

  const oldEditor = state.editors[oldActiveIndex]
  const oldId = ViewletMap.getId(oldEditor.uri)
  const oldInstance = ViewletStates.getInstance(oldId)

  const viewlet = ViewletManager.create(
    ViewletModule.load,
    id,
    ViewletModuleId.Main,
    editor.uri,
    left,
    top,
    width,
    height
  )

  // TODO race condition
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
    /* method */ 'focusAnotherTab',
    /* unFocusIndex */ oldActiveIndex,
    /* focusIndex */ state.activeIndex
  )

  if (BackgroundTabs.has(editor.uri)) {
    console.log('has background true')
    const props = BackgroundTabs.get(editor.uri)
    // @ts-ignore
    await ViewletManager.load(viewlet, false, false, props)
  } else {
    console.log('has background false')
    // @ts-ignore
    await ViewletManager.load(viewlet)
  }

  if (oldInstance && oldInstance.factory.hide) {
    await oldInstance.factory.hide(oldInstance.state)
  }
  return state
}
