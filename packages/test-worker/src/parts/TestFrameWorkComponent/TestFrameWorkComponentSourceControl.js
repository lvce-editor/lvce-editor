import * as Command from '../Command/Command.js'

export const acceptInput = async () => {
  await Command.execute('Source Control.acceptInput')
}

export const handleInput = async (text) => {
  await Command.execute('Source Control.handleInput', text)
}
