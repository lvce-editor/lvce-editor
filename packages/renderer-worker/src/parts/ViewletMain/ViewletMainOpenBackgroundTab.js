export const openBackgroundTab = async (state, initialUri, props) => {
  const { editors, backgroundTabs } = state
  const id = ViewletMap.getId(initialUri)
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const { title, uri } = await ViewletManager.backgroundLoad({
    getModule: ViewletModule.load,
    id,
    left,
    top,
    width,
    height,
    props,
  })
  // TODO update tab title with new title
  const newEditor = { uri, title, id }
  const newEditors = [...editors, newEditor]
  const newBackgroundTab = { uri, title, ...props }
  const newBackgroundTabs = { ...backgroundTabs, [uri]: newBackgroundTab }
  return {
    ...state,
    editors: newEditors,
    backgroundTabs: newBackgroundTabs,
  }
}
