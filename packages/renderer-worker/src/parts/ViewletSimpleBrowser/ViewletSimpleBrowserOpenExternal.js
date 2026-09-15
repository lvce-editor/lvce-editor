import * as Command from '../Command/Command.js'

export const openExternal = async (state) => {
  const { iframeSrc } = state
  if (iframeSrc.startsWith('simple-browser-history://')) {
    return state
  }
  await Command.execute('Open.openExternal', iframeSrc)
  return state
}
