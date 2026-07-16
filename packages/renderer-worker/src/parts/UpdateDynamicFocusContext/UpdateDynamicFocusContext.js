import * as Focus from '../Focus/Focus.js'

const updateDynamic = (commands, key, fn) => {
  const matchingCommands = []
  for (let i = commands.length - 1; i >= 0; i--) {
    const command = commands[i]
    if (command[0] === key) {
      matchingCommands.push(command)
      commands.splice(i, 1)
    }
  }
  // TODO send focus changes to renderer process together with other message
  for (let i = matchingCommands.length - 1; i >= 0; i--) {
    fn(...matchingCommands[i].slice(2))
  }
}

export const updateDynamicFocusContext = (commands) => {
  updateDynamic(commands, 'Viewlet.setFocusContext', Focus.setFocus)
  updateDynamic(commands, 'Viewlet.setAdditionalFocus', Focus.setAdditionalFocus)
  updateDynamic(commands, 'Viewlet.unsetAdditionalFocus', Focus.removeAdditionalFocus)
}

export const updateDynamicKeyBindings = (commands) => {
  updateDynamic(commands, 'Viewlet.setKeyBindings', (keyBindings) => {
    // TODO
  })
}
