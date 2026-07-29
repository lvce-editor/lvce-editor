import * as Focus from '../Focus/Focus.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

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
    fn(matchingCommands[i])
  }
}

const getModuleId = (uid) => {
  return ViewletStates.getByUid(uid)?.moduleId
}

export const updateDynamicFocusContext = (commands) => {
  updateDynamic(commands, 'Viewlet.setFocusContext', (command) => {
    const [, uid, focusKey, additionalFocusKey] = command
    Focus.setFocus(focusKey, additionalFocusKey, uid, getModuleId(uid))
  })
  updateDynamic(commands, 'Viewlet.setAdditionalFocus', (command) => {
    const [, uid, focusKey] = command
    Focus.setAdditionalFocus(focusKey, uid, getModuleId(uid))
  })
  updateDynamic(commands, 'Viewlet.unsetAdditionalFocus', (command) => {
    Focus.removeAdditionalFocus(command[2])
  })
}

export const updateDynamicKeyBindings = (commands) => {
  updateDynamic(commands, 'Viewlet.setKeyBindings', (command) => {
    // TODO
  })
}
