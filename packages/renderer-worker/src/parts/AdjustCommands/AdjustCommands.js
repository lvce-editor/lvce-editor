export const apply = (oldState, newState) => {
  const commands = newState.commands
  newState.commands = []
  if (!commands) {
    return []
  }
  const adjustedCommands = commands.map((command) => {
    if (command[1] === newState.uid) {
      return command
    }
    if (command[0] === 'Viewlet.setDom2') {
      return ['Viewlet.setDom2', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.focusElementByName') {
      return ['Viewlet.focusElementByName', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.focusSelector') {
      return ['Viewlet.focusSelector', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.setValueByName') {
      return ['Viewlet.setValueByName', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.setFocusContext') {
      return ['Viewlet.setFocusContext', newState.uid, ...command.slice(1)]
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
}
