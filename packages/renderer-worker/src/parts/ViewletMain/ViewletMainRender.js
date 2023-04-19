export const hasFunctionalRender = true

const renderDragOverlay = {
  isEqual(oldState, newState) {
    return (
      oldState.dragOverlayVisible === newState.dragOverlayVisible &&
      oldState.dragOverlayX === newState.dragOverlayX &&
      oldState.dragOverlayY === newState.dragOverlayY &&
      oldState.dragOverlayWidth === newState.dragOverlayWidth &&
      oldState.dragOverlayHeight === newState.dragOverlayHeight
    )
  },
  apply(oldState, newState) {
    return [
      'setDragOverlay',
      newState.dragOverlayVisible,
      newState.dragOverlayX,
      newState.dragOverlayY,
      newState.dragOverlayWidth,
      newState.dragOverlayHeight,
    ]
  },
}

export const render = [renderDragOverlay]
