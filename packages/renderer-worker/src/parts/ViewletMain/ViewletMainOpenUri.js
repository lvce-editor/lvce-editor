export const openUri = async (state, uri, focus = true) => {
  Assert.object(state)
  Assert.string(uri)
  const { editors, activeIndex } = state
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const id = ViewletMap.getId(uri)
  for (const editor of editors) {
    if (editor.uri === uri) {
      console.log('found existing editor')
      // TODO if the editor is already open, nothing needs to be done
      const instance = ViewletManager.create(
        ViewletModule.load,
        id,
        ViewletModuleId.Main,
        uri,
        left,
        top,
        width,
        height
      )
      // @ts-ignore

      await ViewletManager.load(instance, focus)
      const selectedIndex = editors.indexOf(editor)
      return {
        ...state,
        selectedIndex,
      }
    }
  }
  const instance = ViewletManager.create(
    ViewletModule.load,
    id,
    ViewletModuleId.Main,
    uri,
    left,
    top,
    width,
    height
  )
  const tabLabel = Workspace.pathBaseName(uri)
  // @ts-ignore
  await ViewletManager.load(instance, focus)
  if (!ViewletStates.hasInstance(id)) {
    return state
  }
  const actualUri = ViewletStates.getState(id).uri
  const newEditor = {
    uri: actualUri,
    title: tabLabel,
    id,
  }
  const newEditors = [...editors, newEditor]
  return {
    ...state,
    editors: newEditors,
  }
}
