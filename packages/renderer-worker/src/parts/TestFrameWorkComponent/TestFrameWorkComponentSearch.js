import * as Command from '../Command/Command.js'

export const setValue = async (value) => {
  await Command.execute('Search.setValue', value)
}
