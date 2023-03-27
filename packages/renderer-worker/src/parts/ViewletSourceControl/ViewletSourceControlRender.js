export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.inputValue === newState.inputValue
  },
  apply(oldState, newState) {
    return [/* method */ 'setInputValue', /* value */ newState.inputValue]
  },
}

const renderChangedFiles = {
  isEqual(oldState, newState) {
    return oldState.displayItems === newState.displayItems
  },
  apply(oldState, newState) {
    return [/* method */ 'setChangedFiles', /* changedFiles */ newState.displayItems]
  },
}

const renderButtons = {
  isEqual(oldState, newState) {
    return oldState.displayItems === newState.displayItems && oldState.buttonIndex === newState.buttonIndex && oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    return [/* method */ 'setItemButtons', /* oldIndex */ oldState.buttonIndex, /* index */ newState.buttonIndex, /* buttons */ newState.buttons]
  },
}

export const render = [renderValue, renderChangedFiles, renderButtons]
