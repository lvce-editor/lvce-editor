const sampleCommand = {
  id: 'xyz.sampleCommand',
  async execute() {
    // TODO make network request that results in an error
    // await vscode.showNotification('abc')
  },
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
}
