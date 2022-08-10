import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const ViewletMenus = await import('../src/parts/ViewletMenu/ViewletMenu.js')

test('render - menus changes', () => {
  const oldState = {
    ...ViewletMenus.create(),
    menus: [],
  }
  const newState = {
    ...oldState,
    menus: [
      {
        id: 'test',
        items: [],
        focusedIndex: -1,
        level: 2,
        x: 0,
        y: 0,
      },
    ],
  }
  expect(ViewletMenus.render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'Menus',
      'setMenus',
      [
        {
          focusedIndex: -1,
          id: 'test',
          items: [],
          level: 2,
          x: 0,
          y: 0,
        },
      ],
    ],
  ])
})
