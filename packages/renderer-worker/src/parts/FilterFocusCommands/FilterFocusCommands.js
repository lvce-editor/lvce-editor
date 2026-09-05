const focusCommands = new Set([
  'Viewlet.focus',
  'Viewlet.focusSelector',
  'Viewlet.setFocusContext',
  'Viewlet.setAdditionalFocus',
  'Viewlet.unsetAdditionalFocus',
  'focus',
  'focusSelector',
  'setFocused',
])

export const filterFocusCommands = (commands) => {
  return commands.filter((command) => !focusCommands.has(command[0] === 'Viewlet.send' ? command[2] : command[0]))
}
