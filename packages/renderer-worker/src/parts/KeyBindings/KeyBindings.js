import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getKeyBindings = async () => {
  return Command.execute(
    /* KeyBindingsInitial.getKeyBindings */ 'KeyBindingsInitial.getKeyBindings'
  )
}

export const hydrate = async () => {
  try {
    const keyBindings = await getKeyBindings()
    await RendererProcess.invoke(
      /* KeyBindings.hydrate */ 'KeyBindings.hydrate',
      /* keyBindings */ keyBindings
    )
  } catch (error) {
    ErrorHandling.handleError(
      // @ts-ignore
      new Error('Failed to load KeyBindings', {
        cause: error,
      })
    )
  }
}

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

export const handleKeyBinding = async (keyBinding) => {
  await Command.execute(
    /* command */ keyBinding.command,
    // TODO should args always be defined? (probably yes -> monomorphism & simpler code since all objects are the same)
    ...(keyBinding.args || [])
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
