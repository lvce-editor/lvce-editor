const sourceControlProvider = {
  languageId: 'xyz',
  getBadgeCount() {
    return 4
  },
  async getChangedFiles() {},
  isActive() {
    return true
  },
}

export const activate = () => {
  vscode.registerSourceControlProvider(sourceControlProvider)
}
