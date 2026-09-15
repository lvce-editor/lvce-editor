import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: jest.fn() }))
jest.unstable_mockModule('../src/parts/EmbedsWorker/EmbedsWorker.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({ get: jest.fn() }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getInstance: jest.fn(), getByUid: jest.fn() }))

const Command = await import('../src/parts/Command/Command.js')
const EmbedsWorker = await import('../src/parts/EmbedsWorker/EmbedsWorker.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const { executeWorkflow } = await import('../src/parts/SimpleBrowserWorkflow/SimpleBrowserWorkflow.js')
const { validateWorkflow } = await import('../src/parts/SimpleBrowserWorkflow/ValidateWorkflow.js')

const workflows = [
  {
    id: 'music',
    tasks: [
      { type: 'open-simple-browser-tab', url: 'example.com' },
      { type: 'press-key', key: 'space' },
      { type: 'press-key', key: 'shift+L' },
    ],
  },
]
const instance = { renderedState: { uid: 7 }, state: { uid: 7, browserViewId: 42 } }

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(Preferences.get).mockReturnValue(workflows)
  jest.mocked(ViewletStates.getInstance).mockReturnValue(instance)
  jest.mocked(ViewletStates.getByUid).mockReturnValue(instance)
})

test('normalizes URLs and keys without changing settings', () => {
  expect(validateWorkflow(workflows, 'music')).toEqual([
    { type: 'open-simple-browser-tab', url: 'https://example.com/' },
    { type: 'press-key', keyCode: 'Space', modifiers: [] },
    { type: 'press-key', keyCode: 'L', modifiers: ['shift'] },
  ])
  expect(workflows[0].tasks[0].url).toBe('example.com')
})

test.each([
  undefined,
  [],
  [...workflows, ...workflows],
  [{ id: 'music', tasks: [] }],
  [{ id: 'music', tasks: [{ type: 'press-key', key: 'space' }] }],
  [{ id: 'music', tasks: [{ type: 'open-simple-browser-tab', url: 'file:///tmp/file' }] }],
  [{ id: 'music', tasks: [...workflows[0].tasks, { type: 'press-key', key: 'invalid+L' }] }],
  [{ id: 'music', tasks: [...workflows[0].tasks, { type: 'press-key', key: 'unknown' }] }],
  [{ id: 'music', tasks: [...workflows[0].tasks, { type: 'unknown' }] }],
])('rejects invalid workflows before opening a browser: %j', async (value) => {
  jest.mocked(Preferences.get).mockReturnValue(value)
  await expect(executeWorkflow('music')).rejects.toThrow()
  expect(Command.execute).not.toHaveBeenCalled()
})

test('waits for navigation before sending sequential keys', async () => {
  const loaded = Promise.withResolvers<void>()
  const started = Promise.withResolvers<void>()
  jest.mocked(EmbedsWorker.invoke).mockImplementationOnce(() => {
    started.resolve()
    return loaded.promise
  })
  const run = executeWorkflow('music')
  await started.promise
  expect(EmbedsWorker.invoke).toHaveBeenCalledTimes(1)
  expect(EmbedsWorker.invoke).toHaveBeenCalledWith('ElectronWebContentsView.navigate', 42, 'https://example.com/')
  await expect(executeWorkflow('music')).rejects.toThrow('already running')
  loaded.resolve()
  await run
  expect(ViewletStates.getByUid).toHaveBeenCalledWith(7)
  expect(jest.mocked(EmbedsWorker.invoke).mock.calls).toEqual([
    ['ElectronWebContentsView.navigate', 42, 'https://example.com/'],
    ['ElectronWebContentsView.insertJavaScript', 42, expect.any(String)],
    ['ElectronWebContentsView.pressKey', 42, 'Space', []],
    ['ElectronWebContentsView.pressKey', 42, 'L', ['shift']],
  ])
})

test('opens workflow tabs without requesting address focus', async () => {
  await executeWorkflow('music')
  expect(Command.execute).toHaveBeenCalledWith('SimpleBrowser.createNewTab', false)
})

test('stops after navigation failure and allows another invocation', async () => {
  jest.mocked(EmbedsWorker.invoke).mockRejectedValueOnce(new Error('load failed'))
  await expect(executeWorkflow('music')).rejects.toThrow('load failed')
  expect(EmbedsWorker.invoke).toHaveBeenCalledTimes(1)
  await expect(executeWorkflow('music')).resolves.toBeUndefined()
})

test('does not send keys after the browser tab is closed', async () => {
  jest.mocked(ViewletStates.getByUid).mockReturnValue(undefined)
  await expect(executeWorkflow('music')).rejects.toThrow('closed or changed')
  expect(EmbedsWorker.invoke).toHaveBeenCalledTimes(2)
})

test('does not send a key until rendering is ready, and rechecks the selected tab afterwards', async () => {
  const frame = Promise.withResolvers<void>()
  const waiting = Promise.withResolvers<void>()
  jest.mocked(EmbedsWorker.invoke).mockImplementation(async (method) => {
    if (method === 'ElectronWebContentsView.insertJavaScript') {
      waiting.resolve()
      await frame.promise
    }
  })
  const run = executeWorkflow('music')
  await waiting.promise
  expect(EmbedsWorker.invoke).not.toHaveBeenCalledWith('ElectronWebContentsView.pressKey', expect.anything(), expect.anything(), expect.anything())
  jest.mocked(ViewletStates.getByUid).mockReturnValue(undefined)
  frame.resolve()
  await expect(run).rejects.toThrow('closed or changed')
  expect(EmbedsWorker.invoke).toHaveBeenCalledTimes(2)
})

test('stops when rendering does not become ready and allows another invocation', async () => {
  jest.mocked(EmbedsWorker.invoke).mockImplementation(async (method) => {
    if (method === 'ElectronWebContentsView.insertJavaScript') {
      throw new Error('The workflow browser tab did not become ready for input')
    }
  })
  await expect(executeWorkflow('music')).rejects.toThrow('did not become ready for input')
  expect(EmbedsWorker.invoke).toHaveBeenCalledTimes(2)
  jest.mocked(EmbedsWorker.invoke).mockReset()
  await expect(executeWorkflow('music')).resolves.toBeUndefined()
})
