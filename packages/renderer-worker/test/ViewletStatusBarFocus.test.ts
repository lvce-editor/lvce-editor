import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js', () => ({
  createWorkerViewlet: () => ({}),
}))
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: jest.fn() }))

const StatusBar = await import('../src/parts/ViewletStatusBar/ViewletStatusBar.ipc.js')

test('focus uses a generic selector command for the owning status bar instance', () => {
  const state = { commands: [], uid: 42 }
  expect(StatusBar.focus(state)).toEqual({
    ...state,
    commands: [['Viewlet.focusSelector', 42, '.StatusBar']],
  })
  expect(state.commands).toEqual([])
})
