import * as EmptySourceControlButtons from '../EmptySourceControlButtons/EmptySourceControlButton.js'

export const getVisibleSourceControlItems = (items, minLineY, maxLineY, buttons, buttonIndex) => {
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const item = items[i]
    const itemButtons = i === buttonIndex ? buttons : EmptySourceControlButtons.emptySourceControlButtons
    visible.push({
      ...item,
      buttons: itemButtons,
    })
  }
  return visible
}
