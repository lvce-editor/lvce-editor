import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'

// TODO extension key bindings

export const getKeyBindings = async () => {
  const assetDir = Platform.getAssetDir()
  const defaultKeyBindings = await Command.execute(
    /* Ajax.getJson */ 'Ajax.getJson',
    /* url */ `${assetDir}/config/defaultKeyBindings.json`
  )
  const actualKeyBindings = defaultKeyBindings
  const keyBindings = actualKeyBindings
  return keyBindings
}
