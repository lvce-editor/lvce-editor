export const name = 'PanelHeader'

export const contentLoaded = async (state) => {}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const selectIndex = async (state, index) => {
  return {
    ...state,
    selectedIndex: index,
  }
}

export const hasFunctionalRender = true

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.views === newState.views
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Panel',
      /* method */ 'setTabs',
      /* tabs */ newState.views,
    ]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Panel',
      /* method */ 'setSelectedIndex',
      /* unFocusIndex */ oldState.selectedIndex,
      /* focusIndex */ newState.selectedIndex,
    ]
  },
}

const renderDimensions = {
  isEqual(oldState, newState) {
    return (
      oldState.headerHeight === newState.headerHeight &&
      oldState.headerWidth === newState.headerWidth &&
      oldState.headerLeft === newState.headerLeft &&
      oldState.headerTop === newState.headerTop
    )
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Panel',
      /* method */ 'setHeaderDimensions',
      /* top */ newState.headerTop,
      /* left */ newState.headerLeft,
      /* width */ newState.headerWidth,
      /* height */ newState.headerHeight,
    ]
  },
}

export const render = [renderTabs, renderSelectedIndex, renderDimensions]

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return state
}
