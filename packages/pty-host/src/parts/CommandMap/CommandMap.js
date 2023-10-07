import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as HandleNodeMessagePort from '../HandleNodeMessagePort/HandleNodeMessagePort.js'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.js'
import * as PtyController from '../PtyController/PtyController.js'
import * as TerminalProcessCommandType from '../TerminalProcessCommandType/TerminalProcessCommandType.js'

export const commandMap = {
  [TerminalProcessCommandType.HandleElectronMessagePort]: HandleElectronMessagePort.handleElectronMessagePort,
  [TerminalProcessCommandType.HandleNodeMessagePort]: HandleNodeMessagePort.handleNodeMessagePort,
  [TerminalProcessCommandType.HandleWebSocket]: HandleWebSocket.handleWebSocket,
  [TerminalProcessCommandType.TerminalCreate]: PtyController.create,
  [TerminalProcessCommandType.TerminalResize]: PtyController.resize,
  [TerminalProcessCommandType.TerminalWrite]: PtyController.write,
  [TerminalProcessCommandType.TerminalDispose]: PtyController.dispose,
}
