import { expect, test } from '@jest/globals'
import * as ViewletChat from '../src/parts/ViewletChat/ViewletChat.ts'
import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletRunAndDebug from '../src/parts/ViewletRunAndDebug/ViewletRunAndDebug.js'
import * as ViewletSourceControl from '../src/parts/ViewletSourceControl/ViewletSourceControl.js'

test.each([
  ['Source Control', ViewletSourceControl.focus, '.SourceControlHeader input'],
  ['Run and Debug', ViewletRunAndDebug.focus, '.RunAndDebug'],
  ['Extensions', ViewletExtensions.focus, '[name="extensions"]'],
  ['Chat', ViewletChat.focus, '[name="composer"]'],
] as const)('%s focuses its primary interactive control', (name, focus, selector) => {
  const state = { commands: [], id: 1 }

  const result = focus(state as any)

  expect(result).toEqual({
    ...state,
    commands: [['Viewlet.focusSelector', selector]],
  })
})
