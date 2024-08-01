export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderAll = {
  isEqual(oldState: any, newState: any) {
    return newState.commands && newState.commands.length === 0
  },
  apply(oldState: any, newState: any) {
    const commands = newState.commands
    newState.commands = []
    if (!commands) {
      return []
    }
    const adjustedCommands = commands.map((command) => {
      if (command[0] === 'Viewlet.setDom2') {
        return ['Viewlet.setDom2', newState.uid, ...command.slice(1)]
      }
      return ['Viewlet.send', newState.uid, ...command]
    })
    return adjustedCommands
  },
  multiple: true,
}

export const render = [renderAll]
