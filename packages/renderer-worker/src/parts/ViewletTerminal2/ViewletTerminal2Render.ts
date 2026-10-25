import * as Preferences from '../Preferences/Preferences.js'

export const hasFunctionalRender = true

const renderTerminal = {
  isEqual(oldState, newState) {
    return oldState.uid === newState.uid && oldState.xtermMounted === newState.xtermMounted
  },
  apply(oldState, newState) {
    return ['setTerminal', newState.uid, Preferences.get('terminal.cursorBlink') === true]
  },
}

export const render = [renderTerminal]
