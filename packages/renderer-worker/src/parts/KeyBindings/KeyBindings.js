import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.ts'
import * as ExtensionKeyBindings from '../ExtensionKeyBindings/ExtensionKeyBindings.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as UserKeyBindings from '../UserKeyBindings/UserKeyBindings.js'

// TODO where to store keybindings? need them here and in renderer process
// how to avoid duplicate loading / where to store them and keep them in sync?
export const lookupKeyBinding = (commandId) => {
  switch (commandId) {
    case 'scm.acceptInput':
      return 'Ctrl+Enter'
    default:
      return ''
  }
}

export const handleKeyBinding = async (identifier) => {
  Assert.number(identifier)
  const keyBinding = KeyBindingsState.getKeyBinding(identifier)
  if (!keyBinding) {
    throw new Error(`keybinding not found for identifier ${identifier}`)
  }
  await Command.execute(
    /* command */ keyBinding.command,
    // TODO should args always be defined? (probably yes -> monomorphism & simpler code since all objects are the same)
    ...(keyBinding.args || []),
  )
  // TODO
  // else if (typeof keyBinding.command === 'string') {
  //   // TODO should calling command be async ? (actually don't care if it resolves -> can just send error event in case of error)
  //   await SharedProcess.invoke(
  //     /* ExtensionHost.executeCommand */ 'ExtensionHost.executeCommand',
  //     /* commandId */ keyBinding.command,
  //     ...(keyBinding.args || [])
  //   )
  // }
}

export const hydrate = async () => {
  const [extensionKeyBindings, userKeyBindings] = await Promise.all([
    ExtensionKeyBindings.getKeyBindings(),
    UserKeyBindings.getKeyBindings(),
  ])
  KeyBindingsState.setKeyBindings('extensions', extensionKeyBindings)
  KeyBindingsState.setKeyBindings('user', userKeyBindings)
}

export const reloadUserKeyBindings = async () => {
  const keyBindings = await UserKeyBindings.getKeyBindings()
  KeyBindingsState.setKeyBindings('user', keyBindings)
}
