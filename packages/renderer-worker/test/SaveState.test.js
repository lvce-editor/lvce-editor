import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/InstanceStorage/InstanceStorage.js', () => ({
  getJson: jest.fn(async () => undefined),
  setJson: jest.fn(async () => {}),
}))

jest.unstable_mockModule('../src/parts/SerializeViewlet/SerializeViewlet.js', () => ({
  serializeInstance: jest.fn(async () => ({ value: 1 })),
}))

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getInstance: jest.fn(() => ({ factory: {}, state: {} })),
}))

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({
  getWorkspacePath: jest.fn(() => '/workspace'),
  isTest: jest.fn(() => false),
}))

const InstanceStorage = await import('../src/parts/InstanceStorage/InstanceStorage.js')
const SaveState = await import('../src/parts/SaveState/SaveState.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('saves viewlet state under the current workspace key', async () => {
  await SaveState.saveViewletState('Explorer')

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('viewlet:%2Fworkspace:Explorer', { value: 1 })
})

test('saves layout state under its global key', async () => {
  await SaveState.saveViewletState('Layout')

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('Layout', { value: 1 })
})

test('saves an instance under a different storage id', async () => {
  await SaveState.saveViewletStateWithStorageId(7, 'SimpleBrowser')

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('viewlet:%2Fworkspace:SimpleBrowser', { value: 1 })
})

test('loads viewlet state from the current workspace key', async () => {
  await SaveState.getSavedViewletState('Main')

  expect(InstanceStorage.getJson).toHaveBeenCalledWith('viewlet:%2Fworkspace:Main')
})
