const callbacks = []

const fileSystemProvider = {
  scheme: 'extension-host',
  readFile(uri) {
    return new Promise((resolve, reject) => {
      callbacks.push({ resolve, reject })
      if (callbacks.length === 3) {
        for (let i = callbacks.length--; i >= 0; i--) {
          const callback = callbacks[i]
          callback.resolve(`content ${i}`)
        }
      }
    })
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
