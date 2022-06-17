export const setWorkspacePath = (extensionHost, path) => {
  return extensionHost.invoke('Workspace.setWorkspacePath', path)
}
