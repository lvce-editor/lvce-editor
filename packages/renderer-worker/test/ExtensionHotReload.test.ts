import { afterEach, expect, jest, test } from '@jest/globals'
import * as ExtensionHotReload from '../src/parts/ExtensionHotReload/ExtensionHotReload.js'

const target = new EventTarget()

const dependencies = {
  disposeWatcher: jest.fn(async (_watcher: Readonly<EventTarget>) => {}),
  invokeExtensionManagement: jest.fn(async (_method: string, _event: unknown) => {}),
  watchFiles: jest.fn(async (_options: unknown) => target),
}

afterEach(async () => {
  await ExtensionHotReload.dispose()
  jest.clearAllMocks()
})

test('watch - asks the file watcher to watch linked roots with development exclusions', async () => {
  await ExtensionHotReload.watch(
    [
      { path: '/extension-one', uri: 'file:///extension-one' },
      { path: '/extension-two', uri: 'file:///extension-two' },
    ],
    dependencies,
  )

  expect(dependencies.watchFiles).toHaveBeenCalledWith({
    exclude: ['.git', 'node_modules'],
    roots: ['file:///extension-one', 'file:///extension-two'],
    useGitIgnore: true,
  })
})

test('watch - forwards generic watcher events to extension management', async () => {
  await ExtensionHotReload.watch([{ path: '/extension', uri: 'file:///extension' }], dependencies)
  const detail = { eventName: 'change', uri: 'file:///extension/src/main.ts' }

  target.dispatchEvent(new CustomEvent('watcher-event', { detail }))

  expect(dependencies.invokeExtensionManagement).toHaveBeenCalledWith('Extensions.handleLinkedExtensionChange', detail)
})
