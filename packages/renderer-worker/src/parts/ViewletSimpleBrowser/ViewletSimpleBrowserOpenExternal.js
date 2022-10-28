import * as Command from '../Command/Command.js'

export const openExternal = async (state) => {
  const { iframeSrc } = state
  await Command.execute('Open.openExternal', iframeSrc)
  return state
}
