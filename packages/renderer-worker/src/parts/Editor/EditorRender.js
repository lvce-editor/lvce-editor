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
        command[0] === 'Viewlet.registerEventListeners' ||
        command[0] === 'Viewlet.setDom2' ||
        command[0] === 'Viewlet.focusSelector' ||
        command[0] === 'Viewlet.setValueByName' ||
        command[0] === 'Viewlet.setSelectionByName' ||
        command[0] === 'Viewlet.setCss' ||
        command[0] === 'Viewlet.appendToBody' ||
        command[0] === 'Viewlet.setBounds' ||
        command[0] === 'Viewlet.registerEventListeners' ||
        command[0] === 'Viewlet.setFocusContext' ||
        command[0] === 'Viewlet.setUid' ||
        command[0] === 'Viewlet.dispose'
      ) {
        return command
      }
      return ['Viewlet.send', newState.uid, ...command]
    })
    return adjustedCommands
  },
  multiple: true,
}

export const render = [renderAll]
