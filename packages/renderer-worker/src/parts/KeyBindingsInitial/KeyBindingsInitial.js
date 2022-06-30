import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'

// TODO should avoid many promises somehow
const toFastKeyBinding = async (keyBinding) => {
  const command = await Command.execute(
    /* CommandInfo.getCommandInfo */ 1592,
    /* id */ keyBinding.command
  )
  return {
    ...keyBinding,
    command,
  }
}

// TODO extension key bindings

export const getKeyBindings = async () => {
  const assetDir = Platform.getAssetDir()
  const defaultKeyBindings = await Command.execute(
    /* Ajax.getJson */ 'Ajax.getJson',
    /* url */ `${assetDir}/config/defaultKeyBindings.json`
  )
  const actualKeyBindings = await Promise.all(
    defaultKeyBindings.map(toFastKeyBinding)
  )
  const keyBindings = actualKeyBindings
  return keyBindings
}
