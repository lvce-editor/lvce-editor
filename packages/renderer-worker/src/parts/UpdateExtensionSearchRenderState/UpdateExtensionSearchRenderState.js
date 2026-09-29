const isSetTitleCommand = (command) => {
  return command[0] === 'Viewlet.send' && command[2] === 'setTitle'
}

export const updateExtensionSearchRenderState = (state, commands) => {
  const titleCommand = commands.findLast(isSetTitleCommand)
  if (!titleCommand) {
    return {
      ...state,
      commands,
    }
  }
  return {
    ...state,
    commands: commands.filter((command) => !isSetTitleCommand(command)),
    title: titleCommand[3],
  }
}
