import { jest } from '@jest/globals'
import * as QuickPickReturnValue from '../src/parts/QuickPickReturnValue/QuickPickReturnValue.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    closeWidget: jest.fn(() => {}),
  }
})

const ViewletQuickPick = await import('../src/parts/ViewletQuickPick/ViewletQuickPick.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletQuickPick, oldState, newState, ViewletModuleId.QuickPick)
}

test('create', () => {
  expect(ViewletQuickPick.create()).toBeDefined()
})

test.skip('handleWheel - up', () => {
  const state = {
    ...ViewletQuickPick.create(),
    itemHeight: 22,
    minLineY: 0,
    maxLineY: 2,
    height: 22,
    deltaY: 22,
    items: [
      {
        label: 'index.css',
      },
      {
        label: 'index.html',
      },
    ],
    headerHeight: 0,
  }
  expect(ViewletQuickPick.handleWheel(state, -22)).toMatchObject({
    minLineY: 0,
    maxLineY: 1,
  })
})

test('handleClickAt - first item', async () => {
  const provider = {
    selectPick: jest.fn(() => {
      return {
        command: QuickPickReturnValue.Hide,
      }
    }),
    getPicks() {
      return []
    },
    getFilterValue(value) {
      return value
    },
  }
  const state = {
    ...ViewletQuickPick.create(),
    itemHeight: 22,
    minLineY: 0,
    maxLineY: 2,
    height: 22,
    deltaY: 22,
    items: [
      {
        label: 'index.css',
      },
      {
        label: 'index.html',
      },
    ],
    provider,
    top: 0,
    headerHeight: 0,
  }
  await ViewletQuickPick.handleClickAt(state, 0, 13)
  expect(provider.selectPick).toHaveBeenCalledTimes(1)
  expect(provider.selectPick).toHaveBeenCalledWith(
    {
      label: 'index.css',
    },
    0,
    0
  )
})

test('render - set correct height', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
    itemHeight: 22,
    height: 22,
    deltaY: 22,
    items: [],
    minLineY: 0,
    maxLineY: 10,
    provider: {
      getPickLabel(pick) {
        return pick.label
      },
      getPickIcon() {
        return ''
      },
    },
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'index.css',
      },
    ],
  }
  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'QuickPick',
      'setVisiblePicks',
      [
        {
          icon: '',
          label: 'index.css',
          posInSet: 1,
          setSize: 1,
        },
      ],
    ],
    ['Viewlet.send', 'QuickPick', 'setCursorOffset', 0],
    ['Viewlet.send', 'QuickPick', 'setItemsHeight', 22],
  ])
})
