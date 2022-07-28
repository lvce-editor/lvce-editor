import * as Command from '../Command/Command.js'

export const openContextMenu = async (index) => {
  await Command.execute('Explorer.handleContextMenu', 0, 0, index)
}

export const focus = async () => {
  await Command.execute('Explorer.focusIndex', -1)
}
