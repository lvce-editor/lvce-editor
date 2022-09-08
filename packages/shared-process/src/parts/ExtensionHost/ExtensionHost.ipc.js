import * as Command from '../Command/Command.js'
import * as ExtensionHost from './ExtensionHost.js'
import * as ExtensionHostCommand from './ExtensionHostCommand.js'
import * as ExtensionHostKeyBindings from './ExtensionHostKeyBindings.js'

// prettier-ignore
export const Commands = {


  'ExtensionHost.dispose': ExtensionHost.dispose,
  'ExtensionHost.getCommands': ExtensionHostCommand.getCommandsIpc,
  'ExtensionHost.send': ExtensionHost.send,
  'ExtensionHost.start': ExtensionHost.start,
  'ExtensionHostCompletion.execute': ExtensionHost.forward,
  'ExtensionHostExtension.activate': ExtensionHost.forward,
  'ExtensionHostExtension.disable': ExtensionHost.forward,
  'ExtensionHostKeyBindings.getKeyBindings': ExtensionHostKeyBindings.getKeyBindings,
  'ExtensionHostSemanticTokens.executeSemanticTokenProvider': ExtensionHost.forward,
  'ExtensionHostTextDocument.setLanguageId': ExtensionHost.forward,
  'ExtensionHostTextDocument.syncFull': ExtensionHost.forward,
  'ExtensionHostTextDocument.syncIncremental': ExtensionHost.forward,
}
