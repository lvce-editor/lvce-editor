import * as Focus from '../Focus/Focus.js'

const updateDynamic = (commands, key, fn) => {
  const keyIndex = commands.findIndex((command) => command[0] === key)
  let args = []
  if (keyIndex !== -1) {
    const command = commands[keyIndex]
    args = command.slice(2)
    commands.splice(keyIndex, 1)
  }
  // TODO send focus changes to renderer process together with other message
  if (args.length) {
    fn(...args)
  }
}

export const updateDynamicFocusContext = (commands) => {
  updateDynamic(commands, 'Viewlet.setFocusContext', Focus.setFocus)
}

export const updateDynamicKeyBindings = (commands) => {
  updateDynamic(commands, 'Viewlet.setKeyBindings', (keyBindings) => {
    // TODO
  })
}
