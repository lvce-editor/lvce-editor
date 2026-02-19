export const hasFunctionalRender = true

const renderCanvas = {
  isEqual(oldState, newState) {
    return oldState.canvasCursorId === newState.canvasCursorId && oldState.canvasTextId === newState.canvasTextId
  },
  apply(oldState, newState) {
    return ['setTerminal', newState.canvasCursorId, newState.canvasTextId]
  },
}

export const render = [renderCanvas]
