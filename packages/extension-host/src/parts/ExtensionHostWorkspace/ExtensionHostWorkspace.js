export const state = {
  workspace: '',
}

export const getWorkspaceFolder = () => {
  return state.workspace
}

// TODO name: workspacePath vs workspaceFolder
export const setWorkspaceFolder = (value) => {
  // TODO send to renderer-worker
  state.workspace = value
}
