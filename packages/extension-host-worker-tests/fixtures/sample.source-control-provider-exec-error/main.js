const sourceControlProvider = {
  languageId: 'xyz',
  getBadgeCount() {
    return 4
  },
  async getChangedFiles() {
    await vscode.exec('test-source-control', ['get-files'])
  },
  isActive() {
    return true
  },
}

export const activate = () => {
  vscode.registerSourceControlProvider(sourceControlProvider)
}
