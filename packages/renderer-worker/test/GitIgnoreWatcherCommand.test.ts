import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GitIgnoreWatcher/GitIgnoreWatcher.js', () => ({ watch: jest.fn(async () => {}) }))

const { commandMap } = await import('../src/parts/CommandMap/CommandMap.js')
const GitIgnoreWatcher = await import('../src/parts/GitIgnoreWatcher/GitIgnoreWatcher.js')
const Command = await import('../src/parts/Command/Command.js')
const Module = await import('../src/parts/Module/Module.js')
Command.setLoad(Module.load)

test('dispatches explorer watcher registration through the renderer RPC command map', async () => {
  const directories = ['file:///workspace', 'file:///workspace/sub']
  await commandMap['FileWatcher.watchGitIgnore'](42, 'file:///workspace', directories)
  expect(GitIgnoreWatcher.watch).toHaveBeenCalledWith(42, 'file:///workspace', directories)
})

test('dispatches explorer worker requests through the legacy command loader', async () => {
  await Command.execute('FileWatcher.watchGitIgnore', 43, 'file:///workspace', ['file:///workspace'])
  expect(GitIgnoreWatcher.watch).toHaveBeenCalledWith(43, 'file:///workspace', ['file:///workspace'])
})
