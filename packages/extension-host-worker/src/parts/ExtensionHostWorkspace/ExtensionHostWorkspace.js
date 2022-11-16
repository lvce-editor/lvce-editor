export const state = {
  workspacePath: '',
}

export const setWorkspacePath = (path) => {
  state.workspacePath = path
}

export const getWorkspaceFolder = (path) => {
  return state.workspacePath
}
