const commandSample = {
  id: 'command-provider.sampleCommand',
  execute() {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerCommand(commandSample)
}
