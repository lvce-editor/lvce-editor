import * as Focus from '../Focus/Focus.js'

export const updateDynamicFocusContext = (commands) => {
  const setFocusContextIndex = commands.findIndex((command) => command[0] === 'Viewlet.setFocusContext')
  let focusContext = 0
  if (setFocusContextIndex !== -1) {
    const command = commands[setFocusContextIndex]
    focusContext = command[2]
    commands.splice(setFocusContextIndex, 1)
  }
  // TODO send focus changes to renderer process together with other message
  if (focusContext) {
    Focus.setFocus(focusContext)
  }
}
