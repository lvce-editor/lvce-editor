const sampleCommand = {
  id: 'other-id',
  execute() {
    throw new Error('oops')
  },
}

export const activate = () => {
  vscode.registerCommand(sampleCommand)
}
