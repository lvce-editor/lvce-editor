const sourceControlProvider = {
  languageId: 'xyz',
  getBadgeCount() {
    return 4
  },
  async getChangedFiles() {
    return ['file-1.txt', 'file-2.txt']
  },
  isActive() {
    return true
  },
}

export const activate = () => {
  vscode.registerSourceControlProvider(sourceControlProvider)
}
