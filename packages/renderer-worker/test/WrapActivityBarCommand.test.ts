import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => ({
  invoke: jest.fn(async (command: string) => {
    if (command === 'ActivityBar.diff2' || command === 'ActivityBar.render2') {
      return []
    }
    return undefined
  }),
}))

jest.unstable_mockModule('../src/parts/Focus/Focus.js', () => ({
  clearFocus: jest.fn(),
  setFocus: jest.fn(),
}))

const ActivityBarWorker = await import('../src/parts/ActivityBarWorker/ActivityBarWorker.js')
const Focus = await import('../src/parts/Focus/Focus.js')
const FocusKey = await import('../src/parts/FocusKey/FocusKey.js')
const { wrapActivityBarCommand } = await import('../src/parts/WrapActivityBarCommand/WrapActivityBarCommand.ts')
const invoke = jest.mocked(ActivityBarWorker.invoke)

beforeEach(() => {
  jest.clearAllMocks()
})

test('handleFocus sets the activity bar keyboard context', async () => {
  const state = { uid: 7 }

  await wrapActivityBarCommand('handleFocus')(state)

  expect(Focus.setFocus).toHaveBeenCalledWith(FocusKey.ActivityBar)
  expect(Focus.clearFocus).not.toHaveBeenCalled()
  expect(ActivityBarWorker.invoke).toHaveBeenNthCalledWith(1, 'ActivityBar.handleFocus', 7)
})

test('handleBlur clears the activity bar keyboard context', async () => {
  const state = { uid: 7 }

  await wrapActivityBarCommand('handleBlur')(state)

  expect(Focus.clearFocus).toHaveBeenCalledWith(FocusKey.ActivityBar)
  expect(Focus.setFocus).not.toHaveBeenCalled()
  expect(ActivityBarWorker.invoke).toHaveBeenNthCalledWith(1, 'ActivityBar.handleBlur', 7)
})

test('other activity bar commands do not change the keyboard context', async () => {
  const state = { uid: 7 }

  await wrapActivityBarCommand('focusNext')(state)

  expect(Focus.clearFocus).not.toHaveBeenCalled()
  expect(Focus.setFocus).not.toHaveBeenCalled()
})

test('serializes activity bar click intents', async () => {
  const firstClick = Promise.withResolvers<void>()
  let clickCount = 0
  invoke.mockImplementation(async (command: string) => {
    if (command === 'ActivityBar.handleClick') {
      clickCount++
      if (clickCount === 1) {
        await firstClick.promise
      }
      return undefined
    }
    if (command === 'ActivityBar.diff2' || command === 'ActivityBar.render2') {
      return []
    }
    return undefined
  })
  const state = { uid: 7 }
  const handleClick = wrapActivityBarCommand('handleClick')

  const first = handleClick(state)
  await Promise.resolve()
  const second = handleClick(state)
  await Promise.resolve()

  expect(invoke.mock.calls.filter((call) => call[0] === 'ActivityBar.handleClick')).toHaveLength(1)

  firstClick.resolve()
  await Promise.all([first, second])

  expect(invoke.mock.calls.filter((call) => call[0] === 'ActivityBar.handleClick')).toHaveLength(2)
})
