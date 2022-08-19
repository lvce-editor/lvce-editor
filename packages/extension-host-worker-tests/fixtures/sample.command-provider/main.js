const sampleCommand = {
  id: 'xyz.sampleCommand',
  async execute() {
    await vscode.showNotification('abc')
  },
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
}
