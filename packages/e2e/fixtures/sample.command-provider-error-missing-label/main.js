const commandSample = {
  id: 'command-provider.sampleCommand',
  execute() {
    console.info('sample command executed successfully.')
  },
}

export const activate = () => {
  vscode.registerCommand(commandSample)
}
