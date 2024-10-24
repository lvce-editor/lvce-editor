import * as ExtensionHostState from './ExtensionHostState.js'

export const name = 'ExtensionHostState'

// prettier-ignore
export const Commands = {
  getSavedState: ExtensionHostState.getSavedState,
  saveState: ExtensionHostState.saveState,
}
