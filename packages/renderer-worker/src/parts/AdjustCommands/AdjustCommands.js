export const apply = (oldState, newState) => {
  const commands = newState.commands
  newState.commands = []
  if (!commands) {
    return []
  }
  const adjustedCommands = commands.map((command) => {
    if (command[1] === newState.uid || typeof command[1] === 'number') {
      return command
    }
    if (command[0] === 'Viewlet.setDom2') {
      return ['Viewlet.setDom2', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.setPatches') {
      return ['Viewlet.setPatches', newState.uid, ...command.slice(1)]
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
    if (command[0] === 'Viewlet.setCheckBoxValue') {
      return ['Viewlet.setCheckBoxValue', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.setFocusContext') {
      return ['Viewlet.setFocusContext', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.setAdditionalFocus') {
      return ['Viewlet.setAdditionalFocus', newState.uid, ...command.slice(1)]
    }
    if (command[0] === 'Viewlet.unsetAdditionalFocus') {
      return ['Viewlet.unsetAdditionalFocus', newState.uid, ...command.slice(1)]
    }
    if (
      command[0] === 'Viewlet.create' ||
      command[0] === 'Viewlet.send' ||
      command[0] === 'Viewlet.createFunctionalRoot' ||
      command[0] === 'Viewlet.setDom2' ||
      command[0] === 'Viewlet.setSelectionByName' ||
      command[0] === 'Viewlet.setDragData' ||
      command[0] === 'Viewlet.setCss' ||
      command[0] === 'Viewlet.setProperty' ||
      command[0] === 'Viewlet.setInputValues'
    ) {
      return command
    }
    return ['Viewlet.send', newState.uid, ...command]
  })
  return adjustedCommands
}
