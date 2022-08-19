const sampleCommand = {
  id: 'command-provider.sampleCommand',
  execute() {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
}
