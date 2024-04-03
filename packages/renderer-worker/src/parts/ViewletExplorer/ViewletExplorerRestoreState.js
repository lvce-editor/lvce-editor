import * as Workspace from '../Workspace/Workspace.js'

const getSavedRoot = (savedState, workspacePath) => {
  return workspacePath
}

export const restoreState = (savedState) => {
  if (!savedState) {
    return {
      minLineY: 0,
      deltaY: 0,
    }
  }
  const root = getSavedRoot(savedState, Workspace.state.workspacePath)
  let minLineY = 0
  if (savedState && typeof savedState.minLineY === 'number') {
    minLineY = savedState.minLineY
  }
  let deltaY = 0
  if (savedState && typeof savedState.deltaY === 'number') {
    deltaY = savedState.deltaY
  }
  return {
    ...savedState,
    root,
    minLineY,
    deltaY,
  }
}
