import * as Command from '../Command/Command.js'

export const openContainingFolder = async (state) => {
  await Command.execute('Open.openNativeFolder', /* path */ state.root)
  return state
}
