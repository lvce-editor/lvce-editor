import * as EmptySourceControlButtons from '../EmptySourceControlButtons/EmptySourceControlButton.js'

export const getVisibleSourceControlItems = (items, buttons, buttonIndex) => {
  const visible = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const itemButtons = i === buttonIndex ? buttons : EmptySourceControlButtons.emptySourceControlButtons
    visible.push({
      ...item,
      buttons: itemButtons,
    })
  }
  return visible
}
