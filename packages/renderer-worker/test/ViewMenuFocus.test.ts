import { expect, test } from '@jest/globals'
import * as ViewletChat from '../src/parts/ViewletChat/ViewletChat.ts'
import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletRunAndDebug from '../src/parts/ViewletRunAndDebug/ViewletRunAndDebug.js'
import * as ViewletSourceControl from '../src/parts/ViewletSourceControl/ViewletSourceControl.js'

test.each([
  ['Source Control', ViewletSourceControl.focus, ['Viewlet.focusSelector', '[name="SourceControlInput"]']],
  ['Run and Debug', ViewletRunAndDebug.focus, ['Viewlet.focus', 7]],
  ['Extensions', ViewletExtensions.focus, ['Viewlet.focusSelector', '[name="extensions"]']],
  ['Chat', ViewletChat.focus, ['Viewlet.focusSelector', '[name="composer"]']],
] as const)('%s focuses its primary interactive control', (name, focus, command) => {
  const state = { commands: [], id: 1, uid: 7 }

  const result = focus(state as any)

  expect(result).toEqual({
    ...state,
    commands: [command],
  })
})
