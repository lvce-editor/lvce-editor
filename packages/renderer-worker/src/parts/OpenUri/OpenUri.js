import * as Command from '../Command/Command.js'

export const openUri = async (path, focus = true, props = {}) => {
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ path, /* focus */ focus, props)
}
