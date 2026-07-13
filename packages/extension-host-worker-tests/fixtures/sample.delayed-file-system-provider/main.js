const contents = {
  '/fast.txt': 'fast content',
  '/slow.txt': 'slow content',
}

const getDelay = (uri) => {
  return uri === '/fast.txt' ? 100 : 1200
}

const fileSystemProvider = {
  id: 'delayed-files',
  pathSeparator: '/',
  async readFile(uri) {
    await new Promise((resolve) => setTimeout(resolve, getDelay(uri)))
    return contents[uri]
  },
  readDirWithFileTypes() {
    return []
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
