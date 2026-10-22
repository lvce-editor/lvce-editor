import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.ts'
import * as ExtensionKeyBindings from '../ExtensionKeyBindings/ExtensionKeyBindings.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
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

export const handleKeyBinding = async (identifier, editorUid) => {
  Assert.number(identifier)
  const keyBinding = KeyBindingsState.getKeyBinding(identifier)
  if (!keyBinding) {
    // The renderer can deliver a keydown after the matching bindings have
    // changed but before its identifier update has reached it.
    return
  }
  // Native input can delay a shortcut until focus has moved to another editor.
  // Retain the originating editor instead of resolving the current focus again.
  if (editorUid !== undefined && keyBinding.command.startsWith('Editor.')) {
    const instance = ViewletStates.getByUid(editorUid)
    if (instance?.moduleId !== ViewletModuleId.EditorText) return
    // Worker command IDs are local names; renderer-specific commands such as
    // Editor.save retain their qualified registration.
    const qualified = ['Commands', 'CommandsWithSideEffects', 'LazyCommands', 'CommandsWithSideEffectsLazy'].some(
      (group) => instance.factory[group]?.[keyBinding.command],
    )
    const command = qualified ? keyBinding.command : keyBinding.command.slice('Editor.'.length)
    await Viewlet.executeViewletCommand(editorUid, command, ...(keyBinding.args || []))
    return
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
  const [extensionKeyBindings, userKeyBindings] = await Promise.all([ExtensionKeyBindings.getKeyBindings(), UserKeyBindings.getKeyBindings()])
  KeyBindingsState.setKeyBindings('extensions', extensionKeyBindings)
  KeyBindingsState.setKeyBindings('user', userKeyBindings)
}

export const reloadUserKeyBindings = async () => {
  const keyBindings = await UserKeyBindings.getKeyBindings()
  KeyBindingsState.setKeyBindings('user', keyBindings)
}
