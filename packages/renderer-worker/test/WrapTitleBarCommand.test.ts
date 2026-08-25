import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/TitleBarWorker/TitleBarWorker.js', () => ({
  invoke: jest.fn(),
}))

const TitleBarWorker = await import('../src/parts/TitleBarWorker/TitleBarWorker.js')
const { wrapTitleBarCommand } = await import('../src/parts/ViewletTitleBar/WrapTitleBarCommand.js')
const invoke = jest.mocked(TitleBarWorker.invoke)

beforeEach(() => {
  jest.clearAllMocks()
})

test('serializes title bar commands through rendering', async () => {
  const firstRenderStarted = Promise.withResolvers<void>()
  const firstRender = Promise.withResolvers<void>()
  let diffCount = 0
  let renderCount = 0
  invoke.mockImplementation(async (command: string) => {
    if (command === 'TitleBar.diff3') {
      return [++diffCount]
    }
    if (command === 'TitleBar.render3') {
      renderCount++
      if (renderCount === 1) {
        firstRenderStarted.resolve()
        await firstRender.promise
      }
      return [[`render-${renderCount}`]]
    }
    return undefined
  })
  const state = { uid: 7 }

  const click = wrapTitleBarCommand('handleClickAt')(state)
  await firstRenderStarted.promise
  const focusOut = wrapTitleBarCommand('handleFocusOut')(state)
  await Promise.resolve()

  expect(invoke.mock.calls.map((call) => call[0])).toEqual(['TitleBar.handleClickAt', 'TitleBar.diff3', 'TitleBar.render3'])

  firstRender.resolve()
  await expect(Promise.all([click, focusOut])).resolves.toEqual([
    { uid: 7, commands: [['render-1']] },
    { uid: 7, commands: [['render-2']] },
  ])
  expect(invoke.mock.calls.map((call) => call[0])).toEqual([
    'TitleBar.handleClickAt',
    'TitleBar.diff3',
    'TitleBar.render3',
    'TitleBar.handleFocusOut',
    'TitleBar.diff3',
    'TitleBar.render3',
  ])
})
