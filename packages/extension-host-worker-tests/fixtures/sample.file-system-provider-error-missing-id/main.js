const fileSystemProvider = {
  readFile(uri) {
    return ''
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
