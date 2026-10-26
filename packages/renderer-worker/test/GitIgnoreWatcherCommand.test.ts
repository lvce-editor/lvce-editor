import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GitIgnoreWatcher/GitIgnoreWatcher.js', () => ({ watch: jest.fn(async () => {}) }))

const { commandMap } = await import('../src/parts/CommandMap/CommandMap.js')
const GitIgnoreWatcher = await import('../src/parts/GitIgnoreWatcher/GitIgnoreWatcher.js')

test('dispatches explorer watcher registration through the renderer RPC command map', async () => {
  const directories = ['file:///workspace', 'file:///workspace/sub']
  await commandMap['GitIgnoreWatcher.watch'](42, 'file:///workspace', directories)
  expect(GitIgnoreWatcher.watch).toHaveBeenCalledWith(42, 'file:///workspace', directories)
})
