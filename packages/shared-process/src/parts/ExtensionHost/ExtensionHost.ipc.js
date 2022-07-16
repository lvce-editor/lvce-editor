import * as Command from '../Command/Command.js'
import * as ExtensionHost from './ExtensionHost.js'
import * as ExtensionHostCommand from './ExtensionHostCommand.js'
import * as ExtensionHostKeyBindings from './ExtensionHostKeyBindings.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ExtensionHost.getCommands', ExtensionHostCommand.getCommandsIpc)
  Command.register('ExtensionHostKeyBindings.getKeyBindings', ExtensionHostKeyBindings.getKeyBindings)
  Command.register('ExtensionHost.start', ExtensionHost.start)
  Command.register('ExtensionHost.dispose', ExtensionHost.dispose)
  Command.register('ExtensionHost.send', ExtensionHost.send)

  Command.register('ExtensionHostExtension.activate', ExtensionHost.forward)
  Command.register('ExtensionHostExtension.disable', ExtensionHost.forward)
  Command.register('ExtensionHostSemanticTokens.executeSemanticTokenProvider', ExtensionHost.forward)
  Command.register('ExtensionHostTextDocument.setLanguageId', ExtensionHost.forward)
  Command.register('ExtensionHostTextDocument.syncIncremental', ExtensionHost.forward)
  Command.register('ExtensionHostTextDocument.syncFull', ExtensionHost.forward)
  Command.register('ExtensionHostCompletion.execute', ExtensionHost.forward)
}
