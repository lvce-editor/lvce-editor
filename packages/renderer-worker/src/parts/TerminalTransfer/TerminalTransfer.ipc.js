import * as TerminalTransfer from './TerminalTransfer.js'

export const name = 'TerminalTransfer'

export const Commands = {
  beginPanelTransfer: TerminalTransfer.beginPanelTransfer,
  cancelPanelTransfer: TerminalTransfer.cancelPanelTransfer,
  takePanelTerminal: TerminalTransfer.takePanelTerminal,
  resize: TerminalTransfer.resize,
  commit: TerminalTransfer.commit,
  rollback: TerminalTransfer.rollback,
  attachPanelTerminal: TerminalTransfer.attachPanelTerminal,
}
