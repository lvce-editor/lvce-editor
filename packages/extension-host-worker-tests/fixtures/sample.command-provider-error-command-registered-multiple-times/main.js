const sampleCommand = {
  id: 'xyz.sampleCommand',
  execute() {},
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
  vscode.registerCommand(sampleCommand)
}
