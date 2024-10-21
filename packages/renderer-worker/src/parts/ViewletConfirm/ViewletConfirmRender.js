export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return oldState.productName === newState.productName && oldState.lines === newState.lines
  },
  apply(oldState, newState) {
    const dom = []
    return ['Viewlet.setDom2', dom]
  },
}

export const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    return ['setFocused', newState.focused]
  },
}

export const render = [renderDialog, renderFocus]
