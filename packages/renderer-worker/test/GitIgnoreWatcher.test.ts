import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: jest.fn(async () => {}) }))
jest.unstable_mockModule('../src/parts/FileWatcher/FileWatcher.js', () => ({
  dispose: jest.fn(async () => {}),
  watch: jest.fn(async () => new EventTarget()),
}))

const Command = await import('../src/parts/Command/Command.js')
const FileWatcher = await import('../src/parts/FileWatcher/FileWatcher.js')
const GitIgnoreWatcher = await import('../src/parts/GitIgnoreWatcher/GitIgnoreWatcher.js')

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
})
afterEach(async () => {
  await GitIgnoreWatcher.dispose(1)
  jest.useRealTimers()
})

const emit = (watcher: EventTarget, eventName: string) =>
  watcher.dispatchEvent(
    new CustomEvent('watcher-event', {
      detail: { eventName, uri: 'file:///workspace/.gitignore' },
    }),
  )

test('watches missing root and nested ignore files without recursive workspace watching or ignore filtering', async () => {
  await GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace/sub', 'file:///workspace'])
  expect(FileWatcher.watch).toHaveBeenCalledWith({
    childNames: ['.gitignore'],
    depth: 0,
    exclude: [],
    roots: ['file:///workspace', 'file:///workspace/sub'],
    useGitIgnore: false,
  })
  await jest.runAllTimersAsync()
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 1, 'handleGitIgnoreChange', 'file:///workspace')
  await GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace', 'file:///workspace/sub'])
  expect(FileWatcher.watch).toHaveBeenCalledTimes(1)
})

test('coalesces creation, saved edits and deletion, ignores backend readiness events', async () => {
  await GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace'])
  await jest.runAllTimersAsync()
  jest.mocked(Command.execute).mockClear()
  const watcher = (await jest.mocked(FileWatcher.watch).mock.results[0].value) as EventTarget
  emit(watcher, 'ready')
  await jest.runAllTimersAsync()
  expect(Command.execute).not.toHaveBeenCalled()
  for (const event of ['add', 'change', 'unlink']) emit(watcher, event)
  await jest.runAllTimersAsync()
  expect(Command.execute).toHaveBeenCalledTimes(1)
})

test('switching roots cancels pending refresh and detaches the old subscription', async () => {
  await GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace'])
  const watcher = (await jest.mocked(FileWatcher.watch).mock.results[0].value) as EventTarget
  emit(watcher, 'change')
  await GitIgnoreWatcher.watch(1, 'file:///other', ['file:///other'])
  expect(FileWatcher.dispose).toHaveBeenCalledWith(watcher)
  emit(watcher, 'change')
  await jest.runAllTimersAsync()
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 1, 'handleGitIgnoreChange', 'file:///other')
})

test('disposal closes late registrations without subscribing or refreshing', async () => {
  const pending = Promise.withResolvers<EventTarget>()
  jest.mocked(FileWatcher.watch).mockReturnValueOnce(pending.promise)
  const registration = GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace'])
  await Promise.resolve()
  await GitIgnoreWatcher.dispose(1)
  const watcher = new EventTarget()
  pending.resolve(watcher)
  await registration
  expect(FileWatcher.dispose).toHaveBeenCalledWith(watcher)
  await jest.runAllTimersAsync()
  expect(Command.execute).not.toHaveBeenCalled()
})

test('a late old registration cannot replace a new workspace watcher', async () => {
  const pending = Promise.withResolvers<EventTarget>()
  jest.mocked(FileWatcher.watch).mockReturnValueOnce(pending.promise)
  const registration = GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace'])
  await Promise.resolve()
  await GitIgnoreWatcher.watch(1, 'remote-server://host/new', ['remote-server://host/new'])
  const watcher = new EventTarget()
  pending.resolve(watcher)
  await registration
  expect(FileWatcher.dispose).toHaveBeenCalledWith(watcher)
  await jest.runAllTimersAsync()
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 1, 'handleGitIgnoreChange', 'remote-server://host/new')
})

test('disabling decorations disposes the watcher and pending refresh', async () => {
  await GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace'])
  await GitIgnoreWatcher.watch(1, 'file:///workspace', [])
  expect(FileWatcher.dispose).toHaveBeenCalledTimes(1)
  await jest.runAllTimersAsync()
  expect(Command.execute).not.toHaveBeenCalled()
})

test('unsupported virtual workspaces do not create a disk watcher', async () => {
  await GitIgnoreWatcher.watch(1, 'memfs:///workspace', ['memfs:///workspace'])
  expect(FileWatcher.watch).not.toHaveBeenCalled()
})

test('failed registration is not cached and can be retried', async () => {
  jest.mocked(FileWatcher.watch).mockRejectedValueOnce(new Error('unavailable'))
  await expect(GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace'])).rejects.toThrow('unavailable')
  await GitIgnoreWatcher.watch(1, 'file:///workspace', ['file:///workspace'])
  expect(FileWatcher.watch).toHaveBeenCalledTimes(2)
})
