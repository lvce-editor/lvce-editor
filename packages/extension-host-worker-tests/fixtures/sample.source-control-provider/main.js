const sourceControlProvider = {
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
}

export const activate = () => {
  vscode.registerSourceControlProvider(sourceControlProvider)
}
