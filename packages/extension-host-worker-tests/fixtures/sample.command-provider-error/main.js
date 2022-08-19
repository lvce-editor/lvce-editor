const sampleCommand = {
  id: 'xyz.sampleCommand',
  execute() {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
}
