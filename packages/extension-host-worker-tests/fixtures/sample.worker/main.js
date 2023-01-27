const worker = new Worker('./worker.js', { type: 'module', name: 'Worker' })

const sampleCommand = {
  id: 'xyz.sampleCommand',
  async execute() {
    // TODO invoke worker to get response
    await vscode.showNotification('abc')
  },
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
}
