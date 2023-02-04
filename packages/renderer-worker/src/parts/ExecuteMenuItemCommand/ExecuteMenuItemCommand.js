import * as Command from '../Command/Command.js'
import * as Logger from '../Logger/Logger.js'

export const executeMenuItemCommand = async (item) => {
  if (!item.command) {
    Logger.warn('item has missing command', item)
    return
  }
  const args = item.args || []
  await Command.execute(item.command, ...args)
}
