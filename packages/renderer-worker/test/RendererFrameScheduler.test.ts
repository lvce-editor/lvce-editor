import { beforeEach, expect, jest, test } from '@jest/globals'

const frameCallbacks: Array<(timestamp: number) => void> = []
let currentTime = 0

jest.unstable_mockModule('../src/parts/RequestAnimationFrame/RequestAnimationFrame.js', () => ({
  requestAnimationFrame: jest.fn((callback: (timestamp: number) => void) => {
    frameCallbacks.push(callback)
  }),
}))

jest.unstable_mockModule('../src/parts/Timestamp/Timestamp.js', () => ({
  now: jest.fn(() => currentTime),
}))

const NormalizeRendererCommands = await import('../src/parts/NormalizeRendererCommands/NormalizeRendererCommands.js')
const RendererFrameScheduler = await import('../src/parts/RendererFrameScheduler/RendererFrameScheduler.js')

const rpc = {
  invoke: jest.fn<(...args: any[]) => Promise<any>>(),
  invokeAndTransfer: jest.fn<(...args: any[]) => Promise<any>>(),
}

const flushMicrotasks = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await Promise.resolve()
}

const runAnimationFrame = async (timestamp: number) => {
  const callback = frameCallbacks.shift()
  expect(callback).toBeDefined()
  currentTime = timestamp
  callback!(timestamp)
  await flushMicrotasks()
}

beforeEach(() => {
  frameCallbacks.length = 0
  currentTime = 0
  jest.clearAllMocks()
  rpc.invoke.mockResolvedValue(undefined)
  rpc.invokeAndTransfer.mockResolvedValue(undefined)
  RendererFrameScheduler.reset(rpc)
})

test('coalesces consecutive render batches in arrival order', async () => {
  const first = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'first']])
  const second = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'second']])
  await flushMicrotasks()

  expect(rpc.invoke).not.toHaveBeenCalled()
  await runAnimationFrame(0)
  await Promise.all([first, second])

  expect(rpc.invoke).toHaveBeenCalledTimes(1)
  expect(rpc.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.send', 1, 'first'],
    ['Viewlet.send', 1, 'second'],
  ])
  expect(RendererFrameScheduler.state.frameCount).toBe(1)
})

test('does not send empty patches or an empty render batch', async () => {
  const promise = RendererFrameScheduler.sendMultiple([['Viewlet.setPatches', 1, []]])
  await flushMicrotasks()
  await runAnimationFrame(0)
  await promise

  expect(rpc.invoke).not.toHaveBeenCalled()
  expect(RendererFrameScheduler.state.frameCount).toBe(0)
})

test('uses direct RPCs as ordering barriers', async () => {
  const first = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'first']])
  const barrier = RendererFrameScheduler.invoke('Window.test')
  const second = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'second']])
  await flushMicrotasks()

  await runAnimationFrame(0)
  await first
  await barrier
  await flushMicrotasks()
  await runAnimationFrame(16)
  await second

  expect(rpc.invoke.mock.calls).toEqual([
    ['Viewlet.sendMultiple', [['Viewlet.send', 1, 'first']]],
    ['Window.test'],
    ['Viewlet.sendMultiple', [['Viewlet.send', 1, 'second']]],
  ])
})

test('enforces 16ms spacing on high refresh displays', async () => {
  const first = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'first']])
  await flushMicrotasks()
  await runAnimationFrame(0)
  await first

  const second = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'second']])
  await flushMicrotasks()
  await runAnimationFrame(8)

  expect(rpc.invoke).toHaveBeenCalledTimes(1)
  expect(frameCallbacks).toHaveLength(1)

  await runAnimationFrame(16)
  await second
  expect(rpc.invoke).toHaveBeenCalledTimes(2)
  expect(RendererFrameScheduler.state.frameCount).toBe(2)
})

test('starts frame spacing after the previous RPC completes', async () => {
  let resolveFirst: (() => void) | undefined
  rpc.invoke.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        resolveFirst = resolve
      }),
  )
  const first = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'first']])
  await flushMicrotasks()
  await runAnimationFrame(0)

  currentTime = 10
  resolveFirst!()
  await first

  const second = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'second']])
  await flushMicrotasks()
  await runAnimationFrame(16)

  expect(rpc.invoke).toHaveBeenCalledTimes(1)
  expect(frameCallbacks).toHaveLength(1)

  await runAnimationFrame(26)
  await second
  expect(rpc.invoke).toHaveBeenCalledTimes(2)
})

test('resolves every caller only after its shared frame succeeds', async () => {
  let firstResolved = false
  let secondResolved = false
  const first = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'first']]).then(() => {
    firstResolved = true
  })
  const second = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'second']]).then(() => {
    secondResolved = true
  })
  await flushMicrotasks()

  expect(firstResolved).toBe(false)
  expect(secondResolved).toBe(false)
  await runAnimationFrame(0)
  await Promise.all([first, second])
  expect(firstResolved).toBe(true)
  expect(secondResolved).toBe(true)
})

test('rejects a failed frame and resets CSS optimization state', async () => {
  const error = new Error('renderer failed')
  rpc.invoke.mockRejectedValueOnce(error)
  const command = ['Viewlet.setCss', 1, '.item {}']
  const first = RendererFrameScheduler.sendMultiple([command])
  const second = RendererFrameScheduler.sendMultiple([command])
  const resultsPromise = Promise.allSettled([first, second])
  await flushMicrotasks()
  await runAnimationFrame(0)

  const results = await resultsPromise
  expect(results).toEqual([
    { reason: error, status: 'rejected' },
    { reason: error, status: 'rejected' },
  ])
  expect(NormalizeRendererCommands.state.cssTexts.size).toBe(0)

  const recovered = RendererFrameScheduler.sendMultiple([command])
  await flushMicrotasks()
  await runAnimationFrame(16)
  await recovered
  expect(rpc.invoke).toHaveBeenLastCalledWith('Viewlet.sendMultiple', [command])
})

test('does not send direct empty patches', async () => {
  await RendererFrameScheduler.invoke('Viewlet.setPatches', 1, [])

  expect(rpc.invoke).not.toHaveBeenCalled()
})

test('suppresses unchanged direct stylesheets', async () => {
  await RendererFrameScheduler.invoke('Css.addCssStyleSheet', 'ContributedColorTheme', ':root {}')
  await RendererFrameScheduler.invoke('Css.addCssStyleSheet', 'ContributedColorTheme', ':root {}')

  expect(rpc.invoke).toHaveBeenCalledTimes(1)
  expect(rpc.invoke).toHaveBeenCalledWith('Css.addCssStyleSheet', 'ContributedColorTheme', ':root {}')
})

test('recovers the direct stylesheet cache after an RPC failure', async () => {
  const error = new Error('renderer failed')
  rpc.invoke.mockRejectedValueOnce(error)
  await expect(RendererFrameScheduler.invoke('Css.addCssStyleSheet', 'ContributedColorTheme', ':root {}')).rejects.toBe(error)

  await RendererFrameScheduler.invoke('Css.addCssStyleSheet', 'ContributedColorTheme', ':root {}')

  expect(rpc.invoke).toHaveBeenCalledTimes(2)
})

test('clears direct stylesheet state after disposal', async () => {
  const command = ['Viewlet.setCss', 1, '.item {}']
  const first = RendererFrameScheduler.sendMultiple([command])
  await flushMicrotasks()
  await runAnimationFrame(0)
  await first

  await RendererFrameScheduler.invoke('Viewlet.dispose', 1)

  const second = RendererFrameScheduler.sendMultiple([command])
  await flushMicrotasks()
  await runAnimationFrame(16)
  await second
  expect(rpc.invoke).toHaveBeenLastCalledWith('Viewlet.sendMultiple', [command])
})

test('orders invokeAndTransfer after pending render work', async () => {
  const render = RendererFrameScheduler.sendMultiple([['Viewlet.send', 1, 'render']])
  const transfer = RendererFrameScheduler.invokeAndTransfer('IpcParent.create', {})
  await flushMicrotasks()
  await runAnimationFrame(0)
  await Promise.all([render, transfer])

  expect(rpc.invoke).toHaveBeenCalledTimes(1)
  expect(rpc.invokeAndTransfer).toHaveBeenCalledWith('IpcParent.create', {})
  expect(rpc.invoke.mock.invocationCallOrder[0]).toBeLessThan(rpc.invokeAndTransfer.mock.invocationCallOrder[0])
})
