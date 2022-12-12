const sourceControlProvider = {
  id: 'xyz',
  languageId: 'xyz',
  getBadgeCount() {
    return 4
  },
  getChangedFiles() {
    return [
      {
        file: '/test/file-1.txt',
        status: 1,
      },
      {
        file: '/test/file-2.txt',
        status: 2,
      },
    ]
  },
  acceptInput() {
    throw new TypeError('x is not a function')
  },
  isActive() {
    return true
  },
}

export const activate = () => {
  vscode.registerSourceControlProvider(sourceControlProvider)
}
