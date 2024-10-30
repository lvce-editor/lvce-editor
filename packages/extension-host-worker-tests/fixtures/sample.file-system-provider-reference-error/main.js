const contents = Object.create(null)

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  readFile(uri) {
    throw new Error(
      `VError: Failed to request text from "/language-basics-typescript/3c2c8cd/playground/playground/babel-parser-base.ts": ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor`,
    )
  },
  pathSeparator: '/',
  readDirWithFileTypes() {
    return []
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
