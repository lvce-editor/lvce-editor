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
      return ['Viewlet.send', newState.uid, ...command]
    })
    return adjustedCommands
  },
  multiple: true,
}

export const render = [renderAll]
