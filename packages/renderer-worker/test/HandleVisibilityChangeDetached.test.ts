import { expect, jest, test } from '@jest/globals'
const saveBuiltin = jest.fn()
const saveExtension = jest.fn()
jest.unstable_mockModule('../src/parts/SaveBuiltinState/SaveBuiltinState.js', () => ({ saveBuiltinState: saveBuiltin }))
jest.unstable_mockModule('../src/parts/SaveExtensionState/SaveExtensionState.js', () => ({ saveExtensionState: saveExtension }))
const { state } = await import('../src/parts/LocationState/LocationState.js')
const { handleVisibilityChange } = await import('../src/parts/HandleVisibilityChange/HandleVisibilityChange.js')

test('closing a detached editor does not overwrite parent workspace layout', async () => {
  state.href = 'lvce-oss://-/?editorTransfer=token&workspace=file:///workspace'
  await handleVisibilityChange('hidden')
  expect(saveBuiltin).not.toHaveBeenCalled()
  expect(saveExtension).not.toHaveBeenCalled()
  state.href = ''
})
