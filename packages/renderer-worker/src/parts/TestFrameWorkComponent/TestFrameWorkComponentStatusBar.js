import * as Command from '../Command/Command.js'

export const update = async () => {
  await Command.execute('StatusBar.updateStatusBarItems')
}
