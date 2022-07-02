const commandSample = {
  id: 'command-never-resolves.sampleCommand',
  async execute() {
    await new Promise((resolve) => {})
  },
}

export const activate = () => {
  vscode.registerCommand(commandSample)
}
