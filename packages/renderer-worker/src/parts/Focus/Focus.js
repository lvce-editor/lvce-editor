import * as Command from '../Command/Command.js'

export const focusTerminal = () => {}

export const focusExtensions = () => {}

// TODO are these wrapper functions useful?
export const focusActivityBar = async () => {
  await Command.execute(/* ActivityBar.focus */ 8003)
}

export const focusStatusBar = () => {}

export const focusProblems = () => {}

export const focusExplorer = () => {}

export const focusPreviousTerminal = () => {}

export const focusNextTerminal = () => {}

export const focusDebugConsole = () => {}
