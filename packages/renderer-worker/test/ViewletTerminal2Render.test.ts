import { beforeEach, expect, test } from '@jest/globals'
import * as PreferencesState from '../src/parts/PreferencesState/PreferencesState.js'
import * as ViewletTerminal2Render from '../src/parts/ViewletTerminal2/ViewletTerminal2Render.ts'

beforeEach(() => {
  PreferencesState.setAll({})
})

const oldState = { uid: 1, xtermMounted: false }

test.each([
  ['default', undefined, false],
  ['enabled', true, true],
  ['disabled', false, false],
])('setTerminal forwards the %s cursor blinking preference', (_name, preference, cursorBlink) => {
  if (preference !== undefined) {
    PreferencesState.set('terminal.cursorBlink', preference)
  }
  expect(ViewletTerminal2Render.render[0].apply(oldState, { ...oldState, xtermMounted: true })).toEqual([
    'setTerminal',
    1,
    cursorBlink,
  ])
})
