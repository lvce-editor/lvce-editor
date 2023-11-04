export const hasFunctionalRender = true

const renderLocations = {
  isEqual(oldState, newState) {
    return oldState.displayReferences === newState.displayReferences
  },
  apply(oldState, newState) {
    return [/* Viewlet.invoke */ 'Viewlet.send', /* id */ newState.id, /* method */ 'setLocations', /* references */ newState.displayReferences]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* Viewlet.invoke */ 'Viewlet.send', /* id */ newState.id, /* method */ 'setMessage', /* message */ newState.message]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ newState.id,
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldState.focusedIndex,
      /* newFocusedIndex */ newState.focusedIndex,
    ]
  },
}

export const render = [renderFocusedIndex, renderLocations, renderMessage]
