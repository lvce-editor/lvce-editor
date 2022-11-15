const sampleCommand = {
  id: 'xyz.sampleCommand',
  async execute() {
    // TODO make network request
    // await vscode.showNotification('abc')
  },
}

export const activate = () => {
  console.log('activate mock')
  vscode.registerCommand(sampleCommand)
}
