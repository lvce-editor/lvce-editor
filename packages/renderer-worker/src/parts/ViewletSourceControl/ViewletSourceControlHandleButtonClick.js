import * as ExtensionHostCommand from '../ExtensionHost/ExtensionHostCommands.js'
import { loadContent } from './ViewletSourceControlLoadContent.js'

export const handleButtonClick = async (state, clickedIndex) => {
  const { buttonIndex, buttons, displayItems } = state
  const button = buttons[clickedIndex]
  const item = displayItems[buttonIndex]
  if (!button) {
    return
  }
  await ExtensionHostCommand.executeCommand(button.command, item.file)
  const newState = await loadContent(state)
  return newState
}
