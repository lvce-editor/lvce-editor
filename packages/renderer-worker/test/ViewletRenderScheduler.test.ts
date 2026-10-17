import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const frames: (() => void)[] = []
jest.unstable_mockModule('../src/parts/RequestAnimationFrame/RequestAnimationFrame.js', () => ({
  cancelAnimationFrame: jest.fn(),
  requestAnimationFrame: jest.fn((callback: () => void) => frames.push(callback)),
}))
const IsTest = await import('../src/parts/IsTest/IsTest.js')
const Scheduler = await import('../src/parts/ViewletRenderScheduler/ViewletRenderScheduler.js')

const nextFrame = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve()
  expect(frames.length).toBeGreaterThan(0)
  frames.shift()!()
}

beforeEach(() => {
  frames.length = 0
  IsTest.state.isTest = false
})
afterEach(() => jest.useRealTimers())

test('coalesces notifications and renders each dirty view once at the frame boundary', async () => {
  const firstView = {}
  let value = 'first'
  const render = jest.fn(async () => value)
  const otherRender = jest.fn(async () => 'other')
  const first = Scheduler.schedule(firstView, render)
  const second = Scheduler.schedule(firstView, render)
  const other = Scheduler.schedule({}, otherRender)
  value = 'latest'
  expect(first).toBe(second)
  expect(render).not.toHaveBeenCalled()
  await nextFrame()
  await expect(first).resolves.toBe('latest')
  await other
  expect(render).toHaveBeenCalledTimes(1)
  expect(otherRender).toHaveBeenCalledTimes(1)
})

test('changes arriving during a render wait for a subsequent frame and commit', async () => {
  const view = {}
  const { promise: gate, resolve } = Promise.withResolvers<void>()
  const first = Scheduler.schedule(view, async () => gate)
  await nextFrame()
  const renderNext = jest.fn(async () => {})
  const second = Scheduler.schedule(view, renderNext)
  expect(second).not.toBe(first)
  expect(renderNext).not.toHaveBeenCalled()
  resolve()
  await first
  await nextFrame()
  await second
  expect(renderNext).toHaveBeenCalledTimes(1)
})

test('one failing worker does not prevent other views or later frames from rendering', async () => {
  const view = {}
  const failed = Scheduler.schedule(view, async () => {
    throw new Error('worker failed')
  })
  const rejected = expect(failed).rejects.toThrow('worker failed')
  const other = Scheduler.schedule({}, async () => 'rendered')
  await nextFrame()
  await rejected
  await expect(other).resolves.toBe('rendered')
  const recovered = Scheduler.schedule(view, async () => 'recovered')
  await nextFrame()
  await expect(recovered).resolves.toBe('recovered')
})

test('new instance identities do not inherit an old instance notification', async () => {
  const oldInstance = { uid: 1 }
  const newInstance = { uid: 1 }
  const oldRender = jest.fn(async () => 'old')
  const newRender = jest.fn(async () => 'new')
  const old = Scheduler.schedule(oldInstance, oldRender)
  const current = Scheduler.schedule(newInstance, newRender)
  await nextFrame()
  await expect(old).resolves.toBe('old')
  await expect(current).resolves.toBe('new')
})

test('a suspended animation frame falls back once and ignores its late callback', async () => {
  jest.useFakeTimers()
  const render = jest.fn(async () => {})
  const promise = Scheduler.schedule({}, render)
  for (let i = 0; i < 10; i++) await Promise.resolve()
  await jest.advanceTimersByTimeAsync(100)
  await promise
  frames.shift()!()
  expect(render).toHaveBeenCalledTimes(1)
})
