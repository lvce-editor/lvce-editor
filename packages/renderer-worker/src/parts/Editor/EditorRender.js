const renderAll = {
  isEqual(oldState, newState) {
    return newState.commands && newState.commands.length === 0
  },
  apply(oldState, newState) {
    const commands = newState.commands
    newState.commands = []
    if (!commands) {
      return []
    }
    const adjustedCommands = commands.map((command) => {
      if (
        command[0] === 'Viewlet.create' ||
        command[0] === 'Viewlet.send' ||
        command[0] === 'Viewlet.createFunctionalRoot' ||
        command[0] === 'Viewlet.setDom2'
      ) {
        return command
      }
      console.log({ command })
      return ['Viewlet.send', newState.uid, ...command]
    })
    console.log({ adjustedCommands })
    return adjustedCommands
  },
  multiple: true,
}

export const render = [renderAll]
