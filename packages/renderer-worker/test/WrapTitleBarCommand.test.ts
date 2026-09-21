import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/TitleBarWorker/TitleBarWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletTitleBar/TitleBarMenuOverlay.js', () => ({
  afterRender: jest.fn(),
  show: jest.fn(),
}))

const TitleBarWorker = await import('../src/parts/TitleBarWorker/TitleBarWorker.js')
const TitleBarMenuOverlay = await import('../src/parts/ViewletTitleBar/TitleBarMenuOverlay.js')
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
    if (command === 'TitleBar.getComponentState') {
      return { isMenuOpen: false }
    }
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

  expect(invoke.mock.calls.map((call) => call[0])).toEqual([
    'TitleBar.handleClickAt',
    'TitleBar.getComponentState',
    'TitleBar.diff3',
    'TitleBar.render3',
  ])

  firstRender.resolve()
  await expect(Promise.all([click, focusOut])).resolves.toEqual([
    { uid: 7, titleBarMenuOpen: false, commands: [['render-1']] },
    { uid: 7, titleBarMenuOpen: false, commands: [['render-2']] },
  ])
  expect(invoke.mock.calls.map((call) => call[0])).toEqual([
    'TitleBar.handleClickAt',
    'TitleBar.getComponentState',
    'TitleBar.diff3',
    'TitleBar.render3',
    'TitleBar.handleFocusOut',
    'TitleBar.getComponentState',
    'TitleBar.diff3',
    'TitleBar.render3',
  ])
})

test('shows the Simple Browser overlay when a title bar menu opens', async () => {
  invoke.mockImplementation(async (command: string) => {
    if (command === 'TitleBar.getComponentState') {
      return { isMenuOpen: true }
    }
    if (command === 'TitleBar.diff3') {
      return [1]
    }
    if (command === 'TitleBar.render3') {
      return [['render']]
    }
    return undefined
  })
  const state = { uid: 7 }

  await expect(wrapTitleBarCommand('handleClickAt')(state)).resolves.toEqual({
    uid: 7,
    titleBarMenuOpen: true,
    commands: [['render']],
  })
  expect(TitleBarMenuOverlay.show).toHaveBeenCalledWith()
})

test('does not show the overlay again while switching title bar menus', async () => {
  invoke.mockImplementation(async (command: string) => {
    if (command === 'TitleBar.getComponentState') {
      return { isMenuOpen: true }
    }
    if (command === 'TitleBar.diff3') {
      return [1]
    }
    if (command === 'TitleBar.render3') {
      return [['render']]
    }
    return undefined
  })
  const state = { uid: 7, titleBarMenuOpen: true }

  await wrapTitleBarCommand('handleClickAt')(state)

  expect(TitleBarMenuOverlay.show).not.toHaveBeenCalled()
})

test('workspace notification completes inside a queued menu action', async () => {
  const state = { uid: 8 }
  const notificationStarted = Promise.withResolvers<void>()
  const finishNotification = Promise.withResolvers<void>()
  const order: string[] = []
  invoke.mockImplementation(async (command: string) => {
    if (command === 'TitleBar.handleMenuClick') {
      order.push('menu-start')
      await wrapTitleBarCommand('handleWorkspaceChange')(state, 'memfs:///next')
      order.push('menu-end')
    } else if (command === 'TitleBar.handleWorkspaceChange') {
      order.push('workspace-start')
      notificationStarted.resolve()
      await finishNotification.promise
      order.push('workspace-end')
    } else if (command === 'TitleBar.handleFocusOut') {
      order.push('focus')
    } else if (command === 'TitleBar.getComponentState') {
      return { isMenuOpen: false }
    } else if (command === 'TitleBar.diff3') {
      return []
    }
    return undefined
  })

  const menu = wrapTitleBarCommand('handleMenuClick')(state, 0, 12)
  await notificationStarted.promise
  const focus = wrapTitleBarCommand('handleFocusOut')(state)
  expect(order).toEqual(['menu-start', 'workspace-start'])
  finishNotification.resolve()
  await Promise.all([menu, focus])
  expect(order).toEqual(['menu-start', 'workspace-start', 'workspace-end', 'menu-end', 'focus'])
  expect(invoke).toHaveBeenCalledWith('TitleBar.handleWorkspaceChange', 8, 'memfs:///next')
})
