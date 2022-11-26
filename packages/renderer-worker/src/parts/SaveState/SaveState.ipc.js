import * as SaveState from './SaveState.js'

export const name = 'SaveState'

// prettier-ignore
export const Commands = {
  handleVisibilityChange: SaveState.handleVisibilityChange,
  hydrate: SaveState.hydrate,
}
