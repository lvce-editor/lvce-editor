import extension from './extension.json' with { type: 'json' }

const sampleCommand = {
  id: 'xyz.sampleCommand',
  async execute() {
    await vscode.showNotification(`activation: ${extension.activation}`)
  },
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
}
