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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const QuickPick = await import('../src/parts/QuickPick/QuickPick.js')

const mockProvider = {
  name: 'mock',
  getPlaceholder() {
    return 'mock placeholder'
  },
  getFilterValue(value) {
    return value
  },
  getHelpEntries() {
    return [
      {
        category: 'mock commands',
        description: 'mock help entry',
      },
    ]
  },
  getNoResults() {
    return {
      label: 'mock no result',
    }
  },
  getPicks() {
    return [
      {
        label: 'mock pick 1',
      },
      {
        label: 'mock pick 2',
      },
    ]
  },
  selectPick() {
    return {
      command: 'hide',
    }
  },
  getLabel() {
    return ''
  },
}

beforeEach(() => {
  QuickPick.state.state = /* STATE_DEFAULT */ 0
  QuickPick.state.picks = []
  QuickPick.state.versionId = 0
})

afterEach(() => {
  jest.resetAllMocks()
})

test('show', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await QuickPick.show('', mockProvider)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    1,
    'Viewlet.load',
    'QuickPick'
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    'Viewlet.send',
    'QuickPick',
    'updateValueAndPicksAndPlaceholder',
    '',
    [
      {
        posInSet: 1,
        setSize: 2,
        label: 'mock pick 1',
      },
      {
        posInSet: 2,
        setSize: 2,
        label: 'mock pick 2',
      },
    ],
    0,
    -1,
    'mock placeholder',
    ''
  )
})

test('show called twice', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const promise1 = QuickPick.show('', mockProvider)
  const promise2 = QuickPick.show('', mockProvider)
  await Promise.all([promise1, promise2])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    1,
    'Viewlet.load',
    'QuickPick'
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    'Viewlet.load',
    'QuickPick'
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    3,
    'Viewlet.send',
    'QuickPick',
    'updateValueAndPicksAndPlaceholder',
    '',
    [
      { label: 'mock pick 1', posInSet: 1, setSize: 2 },
      { label: 'mock pick 2', posInSet: 2, setSize: 2 },
    ],
    0,
    -1,
    'mock placeholder',
    ''
  )
})

test('show - item with missing value', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const mockProvider = {
    name: 'mock',
    getPlaceholder() {
      return 'mock placeholder'
    },
    getFilterValue(value) {
      return value
    },
    getHelpEntries() {
      return [
        {
          category: 'mock commands',
          description: 'mock help entry',
        },
      ]
    },
    getNoResults() {
      return {
        label: 'mock no result',
      }
    },
    getPicks() {
      return [
        {
          id: 'mock-pick-1',
        },
        {
          id: 'mock-pick-2',
          label: 'mock pick 2',
        },
      ]
    },
    selectPick() {
      return {
        command: 'hide',
      }
    },
    getLabel() {
      return ''
    },
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await QuickPick.show('', mockProvider)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[QuickPick] item has missing label', {
    id: 'mock-pick-1',
  })
  await QuickPick.show('', mockProvider)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('dispose', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await QuickPick.show('', mockProvider)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  QuickPick.dispose()
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Viewlet.dispose */ 'Viewlet.dispose',
    /* id */ 'QuickPick'
  )
})

test('select', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await QuickPick.show('', mockProvider)
  QuickPick.state.recentPicks = []
  QuickPick.state.filteredPicks = [
    {
      // @ts-ignore
      label: 'test item 1',
    },
  ]
  await QuickPick.selectIndex(0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Viewlet.dispose */ 'Viewlet.dispose',
    /* id */ 'QuickPick'
  )
})

test('show - twice', async () => {
  const mockProvider1 = {
    name: 'mock',
    getPlaceholder() {
      return 'mock placeholder'
    },
    getFilterValue(value) {
      return value
    },
    getHelpEntries() {
      return [
        {
          category: 'mock commands',
          description: 'mock help entry',
        },
      ]
    },
    getNoResults() {
      return {
        label: 'mock no result',
      }
    },
    getPicks() {
      return [
        {
          id: 'mock-pick-1',
        },
        {
          id: 'mock-pick-2',
          label: 'mock pick 2',
        },
      ]
    },
    selectPick() {
      return {
        command: 'hide',
      }
    },
    getLabel() {
      return ''
    },
  }
  const mockProvider2 = {
    name: 'mock',
    getPlaceholder() {
      return 'mock placeholder 2'
    },
    getFilterValue(value) {
      return value
    },
    getHelpEntries() {
      return [
        {
          category: 'mock commands',
          description: 'mock help entry',
        },
      ]
    },
    getNoResults() {
      return {
        label: 'mock no result',
      }
    },
    getPicks() {
      return [
        {
          id: 'mock-pick-1',
        },
        {
          id: 'mock-pick-2',
          label: 'mock pick 2',
        },
      ]
    },
    selectPick() {
      return {
        command: 'hide',
      }
    },
    getLabel() {
      return ''
    },
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await QuickPick.show('', mockProvider1)
  await QuickPick.show('', mockProvider2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'QuickPick',
    'updateValueAndPicksAndPlaceholder',
    '',
    [
      {
        label: undefined,
        posInSet: 1,
        setSize: 2,
      },
      {
        label: 'mock pick 2',
        posInSet: 2,
        setSize: 2,
      },
    ],
    0,
    0,
    'mock placeholder 2',
    ''
  )
})
