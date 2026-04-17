import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ActivityBarWorker = await import('../src/parts/ActivityBarWorker/ActivityBarWorker.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

const activityBarInvokeMock = /** @type {any} */ (ActivityBarWorker.invoke)

beforeEach(() => {
  jest.resetAllMocks()
})

const mockActivityBarRender = () => {
  // @ts-ignore
  ActivityBarWorker.invoke.mockImplementation(async (method, ...args) => {
    switch (method) {
      case 'ActivityBar.handleSideBarViewletChange':
        return undefined
      case 'ActivityBar.diff2':
        expect(args).toEqual([7])
        return 'diff-1'
      case 'ActivityBar.render2':
        expect(args).toEqual([7, 'diff-1'])
        return [['activity-bar.render2']]
      default:
        throw new Error(`unexpected activity bar method: ${method}`)
    }
  })
}

test('showSideBar shows hidden side bar with requested viewlet', async () => {
  mockActivityBarRender()
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'SideBar', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    sideBarView: 'Explorer',
    sideBarVisible: false,
    statusBarHeight: 20,
    titleBarHeight: 0,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.showSideBar(state, 'SourceControl')

  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      args: ['SourceControl'],
      id: 'SideBar',
    }),
    false,
    true,
    undefined,
  )
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarViewletChange', 7, 'SourceControl'],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
  expect(result).toEqual({
    commands: [['Viewlet.createFunctionalRoot', 'SideBar', 1, true], ['activity-bar.render2']],
    newState: expect.objectContaining({
      sideBarView: 'SourceControl',
      sideBarVisible: true,
    }),
  })
})

test('showSideBar switches visible side bar to requested viewlet', async () => {
  mockActivityBarRender()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  const result = await ViewletLayout.showSideBar(state, 'SourceControl')

  expect(ViewletManager.load).not.toHaveBeenCalled()
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarViewletChange', 7, 'SourceControl'],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
  expect(result).toEqual({
    commands: [['activity-bar.render2']],
    newState: {
      ...state,
      sideBarView: 'SourceControl',
      sideBarVisible: true,
    },
  })
})
