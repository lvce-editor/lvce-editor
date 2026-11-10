import { expect, jest, test } from '@jest/globals'

const calls = []
let finishSave
const savePromise = new Promise((resolve) => {
  finishSave = resolve
})

jest.unstable_mockModule('../src/parts/ElectronWindow/ElectronWindow.js', () => ({
  reload: async () => {
    calls.push('reload')
  },
}))

jest.unstable_mockModule('../src/parts/SaveBuiltinState/SaveBuiltinState.js', () => ({
  saveBuiltinState: () => savePromise.then(() => calls.push('save')),
}))

const ReloadElectron = await import('../src/parts/ReloadElectron/ReloadElectron.js')

test('reloadElectron saves built-in state before reloading the window', async () => {
  calls.length = 0

  const reloadPromise = ReloadElectron.reloadElectron()
  expect(calls).toEqual([])
  finishSave()
  await reloadPromise

  expect(calls).toEqual(['save', 'reload'])
})
