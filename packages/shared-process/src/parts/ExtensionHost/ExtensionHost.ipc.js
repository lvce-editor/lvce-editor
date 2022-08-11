import * as Command from '../Command/Command.js'
import * as ExtensionHost from './ExtensionHost.js'
import * as ExtensionHostCommand from './ExtensionHostCommand.js'
import * as ExtensionHostKeyBindings from './ExtensionHostKeyBindings.js'

// prettier-ignore
export const Commands = {

  'ExtensionHost.getCommands': ExtensionHostCommand.getCommandsIpc,
  'ExtensionHostKeyBindings.getKeyBindings': ExtensionHostKeyBindings.getKeyBindings,
  'ExtensionHost.start': ExtensionHost.start,
  'ExtensionHost.dispose': ExtensionHost.dispose,
  'ExtensionHost.send': ExtensionHost.send,

  'ExtensionHostExtension.activate': ExtensionHost.forward,
  'ExtensionHostExtension.disable': ExtensionHost.forward,
  'ExtensionHostSemanticTokens.executeSemanticTokenProvider': ExtensionHost.forward,
  'ExtensionHostTextDocument.setLanguageId': ExtensionHost.forward,
  'ExtensionHostTextDocument.syncIncremental': ExtensionHost.forward,
  'ExtensionHostTextDocument.syncFull': ExtensionHost.forward,
  'ExtensionHostCompletion.execute': ExtensionHost.forward,
}
