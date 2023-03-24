export const hasFunctionalRender = true

const renderProblems = {
  isEqual(oldState, newState) {
    return oldState.problems === newState.problems
  },
  apply(oldState, newState) {
    return [/* method */ 'setProblems', /* problems */ newState.problems]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [/* method */ 'setFocusedIndex', /* focusedIndex */ newState.focusedIndex]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ 'setMessage', /* focusedIndex */ newState.message]
  },
}

export const render = [renderProblems, renderFocusedIndex, renderMessage]
