const fileSystemProvider = {
  id: 'xyz',
  readFile(uri) {
    return ''
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
