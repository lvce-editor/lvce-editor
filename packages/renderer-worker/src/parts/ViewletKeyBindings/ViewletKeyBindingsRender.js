export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderKeyBindings = {
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
      if (command[0] === 'Viewlet.setDom2') {
        return ['Viewlet.setDom2', newState.uid, ...command.slice(1)]
      }
      if (
        command[0] === 'Viewlet.create' ||
        command[0] === 'Viewlet.send' ||
        command[0] === 'Viewlet.createFunctionalRoot' ||
        command[0] === 'Viewlet.setDom2'
      ) {
        return command
      }
      return ['Viewlet.send', newState.uid, ...command]
    })
    return adjustedCommands
  },
  multiple: true,
}

export const render = [renderKeyBindings]
