const callbacks = []

const contents = Object.create(null)

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  readFile(uri) {
    return new Promise((resolve, reject) => {
      callbacks.push({ resolve, reject })
      if (callbacks.length === 3) {
        for (let i = callbacks.length - 1; i >= 0; i--) {
          const callback = callbacks[i]
          callback.resolve(contents[uri])
        }
      }
    })
  },
  pathSeparator: '/',
  readDirWithFileTypes() {
    return []
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
