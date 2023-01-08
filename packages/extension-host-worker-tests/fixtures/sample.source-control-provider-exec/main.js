const toChangedFile = (line) => {
  return {
    file: line,
    status: 1,
  }
}
const sourceControlProvider = {
  languageId: 'xyz',
  getBadgeCount() {
    return 4
  },
  async getChangedFiles() {
    const { stdout } = await vscode.exec('test-source-control', ['get-files'])
    const files = stdout.split('\n').map(toChangedFile)
    return files
  },
  isActive() {
    return true
  },
}

export const activate = () => {
  vscode.registerSourceControlProvider(sourceControlProvider)
}
