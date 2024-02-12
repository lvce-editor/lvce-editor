import * as ExtensionHostCommand from '../ExtensionHost/ExtensionHostCommands.js'
import { loadContent } from './ViewletSourceControlLoadContent.js'

export const handleButtonClick = async (state, clickedIndex) => {
  const { buttonIndex, buttons, items } = state
  const button = buttons[clickedIndex]
  const item = items[buttonIndex]
  if (!button) {
    return
  }
  await ExtensionHostCommand.executeCommand(button.command, item.file)
  const newState = await loadContent(state)
  return newState
}
