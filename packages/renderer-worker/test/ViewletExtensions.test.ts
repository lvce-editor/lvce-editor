import { beforeEach, expect, jest, test } from '@jest/globals'

let renderCommands: readonly any[] = []

jest.unstable_mockModule('../src/parts/ExtensionSearchViewWorker/ExtensionSearchViewWorker.js', () => ({
  invoke: jest.fn(async (command: string) => {
    if (command === 'SearchExtensions.diff2') {
      return []
    }
    if (command === 'SearchExtensions.render3') {
      return renderCommands
    }
    if (command === 'SearchExtensions.getCommandIds') {
      return []
    }
    return undefined
  }),
  restart: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 2),
}))

jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.js', () => ({
  assetDir: '/test-assets',
}))

const ExtensionSearchViewWorker = await import('../src/parts/ExtensionSearchViewWorker/ExtensionSearchViewWorker.js')
const ViewletExtensions = await import('../src/parts/ViewletExtensions/ViewletExtensions.js')

beforeEach(() => {
  jest.clearAllMocks()
  renderCommands = []
})

test('moves the worker title command into wrapper state', async () => {
  renderCommands = [
    ['Viewlet.send', 42, 'setTitle', 'Extensions: Marketplace'],
    ['Viewlet.setDom2', 1, []],
  ]
  const state = ViewletExtensions.create(1, 'extensions://', 10, 20, 800, 600, [], 42)

  const result = await ViewletExtensions.loadContent(state)

  expect(result.title).toBe('Extensions: Marketplace')
  expect(result.commands).toEqual([['Viewlet.setDom2', 1, []]])
})

test('sets the default title when the worker has no title command', async () => {
  const state = ViewletExtensions.create(1, 'extensions://', 10, 20, 800, 600, [], 42)

  const result = await ViewletExtensions.loadContent(state)

  expect(state.title).toBe('')
  expect(result.title).toBe('Extensions: Installed')
})

test('forwards the parent view uid to the extension search worker', async () => {
  const state = ViewletExtensions.create(1, 'extensions://', 10, 20, 800, 600, [], 42)

  await ViewletExtensions.loadContent(state)

  expect(state.parentUid).toBe(42)
  expect(ExtensionSearchViewWorker.invoke).toHaveBeenNthCalledWith(
    1,
    'SearchExtensions.create',
    1,
    undefined,
    10,
    20,
    800,
    600,
    2,
    '/test-assets',
    42,
  )
})

test('handleExtensionsChanged refreshes and renders the extension search view', async () => {
  const state = ViewletExtensions.create(1, 'extensions://', 10, 20, 800, 600, [], 42)

  const result = await ViewletExtensions.handleExtensionsChanged(state, 'builtin.language-features-typescript', true)

  expect(ExtensionSearchViewWorker.invoke).toHaveBeenNthCalledWith(1, 'SearchExtensions.handleExtensionsChanged', 1)
  expect(ExtensionSearchViewWorker.invoke).toHaveBeenNthCalledWith(2, 'SearchExtensions.diff2', 1)
  expect(ExtensionSearchViewWorker.invoke).toHaveBeenNthCalledWith(3, 'SearchExtensions.render3', 1, [])
  expect(result).toEqual({
    ...state,
    commands: [],
    title: 'Extensions: Installed',
  })
})

test('getCommands includes the extension change handler', async () => {
  await ViewletExtensions.getCommands()

  expect(typeof ViewletExtensions.Commands['handleExtensionsChanged']).toBe('function')
})
