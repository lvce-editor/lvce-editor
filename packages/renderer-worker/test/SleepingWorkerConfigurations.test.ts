/* eslint-disable jest/no-restricted-jest-methods -- Worker configuration tests use ESM module mocks for worker dependencies. */
import { expect, jest, test } from '@jest/globals'

const activityBarWorker = {
  invoke: jest.fn(),
  restart: jest.fn(),
  sleep: jest.fn(),
}
const titleBarWorker = {
  invoke: jest.fn(),
  restart: jest.fn(),
  sleep: jest.fn(),
}

jest.unstable_mockModule('../src/parts/GetOrCreateWorkerWithSleep/GetOrCreateWorkerWithSleep.js', () => ({
  getOrCreateWorkerWithSleep: jest.fn().mockReturnValueOnce(activityBarWorker).mockReturnValueOnce(titleBarWorker),
}))

jest.unstable_mockModule('../src/parts/LaunchActivityBarWorker/LaunchActivityBarWorker.ts', () => ({
  launchActivityBarWorker: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/LaunchTitleBarWorker/LaunchTitleBarWorker.js', () => ({
  launchTitleBarWorker: jest.fn(),
}))

const ActivityBarWorker = await import('../src/parts/ActivityBarWorker/ActivityBarWorker.js')
const GetOrCreateWorkerWithSleep = await import('../src/parts/GetOrCreateWorkerWithSleep/GetOrCreateWorkerWithSleep.js')
const LaunchActivityBarWorker = await import('../src/parts/LaunchActivityBarWorker/LaunchActivityBarWorker.ts')
const LaunchTitleBarWorker = await import('../src/parts/LaunchTitleBarWorker/LaunchTitleBarWorker.js')
const TitleBarWorker = await import('../src/parts/TitleBarWorker/TitleBarWorker.js')

test('configures the activity bar worker sleep lifecycle', () => {
  expect(GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep).toHaveBeenNthCalledWith(
    1,
    LaunchActivityBarWorker.launchActivityBarWorker,
    'ActivityBar.sleep',
    'ActivityBar.wakeUp',
  )
  expect(ActivityBarWorker.invoke).toBe(activityBarWorker.invoke)
  expect(ActivityBarWorker.restart).toBe(activityBarWorker.restart)
  expect(ActivityBarWorker.sleep).toBe(activityBarWorker.sleep)
})

test('configures the title bar worker sleep lifecycle', () => {
  expect(GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep).toHaveBeenNthCalledWith(
    2,
    LaunchTitleBarWorker.launchTitleBarWorker,
    'TitleBar.sleep',
    'TitleBar.wakeUp',
  )
  expect(TitleBarWorker.invoke).toBe(titleBarWorker.invoke)
  expect(TitleBarWorker.restart).toBe(titleBarWorker.restart)
  expect(TitleBarWorker.sleep).toBe(titleBarWorker.sleep)
})
