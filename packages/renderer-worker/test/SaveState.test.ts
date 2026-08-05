import { beforeEach, expect, jest, test } from '@jest/globals'

const getInstance = jest.fn<() => any>(() => ({ factory: {}, state: {} }))

jest.unstable_mockModule('../src/parts/InstanceStorage/InstanceStorage.js', () => ({
  getJson: jest.fn(async () => undefined),
  setJson: jest.fn(async () => {}),
}))

jest.unstable_mockModule('../src/parts/SerializeViewlet/SerializeViewlet.js', () => ({
  serializeInstance: jest.fn(async () => ({ value: 1 })),
}))

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getInstance,
}))

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({
  getWorkspaceUri: jest.fn(() => 'file:///workspace'),
  isTest: jest.fn(() => false),
}))

const InstanceStorage = await import('../src/parts/InstanceStorage/InstanceStorage.js')
const SaveState = await import('../src/parts/SaveState/SaveState.js')
const SaveStateIpc = await import('../src/parts/SaveState/SaveState.ipc.js')

beforeEach(() => {
  jest.clearAllMocks()
  getInstance.mockReturnValue({ factory: {}, state: {} })
})

test('saves viewlet state under the current workspace key', async () => {
  await SaveState.saveViewletState('Explorer')

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('viewlet:file:///workspace:Explorer', { value: 1 })
})

test('saves viewlet state under its instance storage key', async () => {
  getInstance.mockReturnValue({
    factory: {
      getStorageKey: (state: { uri: string }) => `Editor:${state.uri}`,
    },
    state: {
      uri: 'file:///workspace/file.txt',
    },
  })

  await SaveState.saveViewletState(7)

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('viewlet:file:///workspace:Editor:file:///workspace/file.txt', { value: 1 })
})

test('saves layout state under its global key', async () => {
  await SaveState.saveViewletState('Layout')

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('Layout', { value: 1 })
})

test('saves an instance under a different storage id', async () => {
  await SaveState.saveViewletStateWithStorageId(7, 'SimpleBrowser')

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('viewlet:file:///workspace:SimpleBrowser', { value: 1 })
})

test('exposes workspace-scoped instance saving over renderer rpc', async () => {
  await SaveStateIpc.Commands.saveViewletStateWithStorageId(7, 'Problems')

  expect(InstanceStorage.setJson).toHaveBeenCalledWith('viewlet:file:///workspace:Problems', { value: 1 })
})

test('loads viewlet state from the current workspace key', async () => {
  await SaveState.getSavedViewletState('Main')

  expect(InstanceStorage.getJson).toHaveBeenCalledWith('viewlet:file:///workspace:Main')
})
