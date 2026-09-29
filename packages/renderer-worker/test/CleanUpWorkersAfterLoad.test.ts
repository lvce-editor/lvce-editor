/* eslint-disable jest/no-restricted-jest-methods -- Startup cleanup tests use ESM module mocks for worker dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'

const activityBarSleep = jest.fn()
const getPreference = jest.fn()
const getInstance = jest.fn()
const titleBarSleep = jest.fn()

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => ({
  sleep: activityBarSleep,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
}))

jest.unstable_mockModule('../src/parts/TitleBarWorker/TitleBarWorker.js', () => ({
  sleep: titleBarSleep,
}))

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getInstance,
}))

const CleanUpWorkersAfterLoad = await import('../src/parts/CleanUpWorkersAfterLoad/CleanUpWorkersAfterLoad.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('does not clean up workers by default', async () => {
  getPreference.mockReturnValue(false)

  await CleanUpWorkersAfterLoad.cleanUpWorkersAfterLoad()

  expect(getPreference).toHaveBeenCalledTimes(1)
  expect(getPreference).toHaveBeenCalledWith('Workers.cleanUpAfterLoad')
  expect(activityBarSleep).not.toHaveBeenCalled()
  expect(titleBarSleep).not.toHaveBeenCalled()
})

test('sleeps loaded activity bar and title bar workers when enabled', async () => {
  getPreference.mockReturnValue(true)
  getInstance.mockImplementation((moduleId) => {
    if (moduleId === 'ActivityBar') {
      return { state: { uid: 1 } }
    }
    return { state: { uid: 2 } }
  })

  await CleanUpWorkersAfterLoad.cleanUpWorkersAfterLoad()

  expect(activityBarSleep).toHaveBeenCalledTimes(1)
  expect(activityBarSleep).toHaveBeenCalledWith(1)
  expect(titleBarSleep).toHaveBeenCalledTimes(1)
  expect(titleBarSleep).toHaveBeenCalledWith(2)
})

test('skips component workers that were not loaded', async () => {
  getPreference.mockReturnValue(true)
  getInstance.mockImplementation((moduleId) => {
    if (moduleId === 'ActivityBar') {
      return { state: { uid: 1 } }
    }
    return undefined
  })

  await CleanUpWorkersAfterLoad.cleanUpWorkersAfterLoad()

  expect(activityBarSleep).toHaveBeenCalledTimes(1)
  expect(activityBarSleep).toHaveBeenCalledWith(1)
  expect(titleBarSleep).not.toHaveBeenCalled()
})
