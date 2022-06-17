import { jest } from '@jest/globals'
import * as QuickPick from '../src/parts/QuickPick/QuickPick.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await QuickPick.show('', mockProvider)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    /* QuickPick.hydrate */ 909090,
    3,
    3030,
    'QuickPick',
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    3024,
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
    '',
  ])
})

test('show called twice', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  const promise1 = QuickPick.show('', mockProvider)
  const promise2 = QuickPick.show('', mockProvider)
  await Promise.all([promise1, promise2])
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(3)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    3030,
    'QuickPick',
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    3030,
    'QuickPick',
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(3, [
    3024,
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
    '',
  ])
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
      case 3026:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await QuickPick.show('', mockProvider)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[QuickPick] item has missing label', {
    id: 'mock-pick-1',
  })
  await QuickPick.show('', mockProvider)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('dispose', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
      case 3026:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await QuickPick.show('', mockProvider)
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
      case 3026:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  QuickPick.dispose()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    /* Viewlet.dispose */ 3026,
    /* id */ 'QuickPick',
  ])
})

test('select', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
      case 3026:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })

  await QuickPick.show('', mockProvider)
  QuickPick.state.recentPicks = []
  QuickPick.state.filteredPicks = [
    {
      label: 'test item 1',
    },
  ]
  await QuickPick.selectIndex(0)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    /* Viewlet.dispose */ 3026,
    /* id */ 'QuickPick',
  ])
})

test('focusFirst', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })

  await QuickPick.focusFirst()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    /* Viewlet.send */ 3024,
    /* id */ 'QuickPick',
    /* method */ 'focusIndex',
    0,
    0,
  ])
})

test('focusLast', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })

  await QuickPick.focusLast()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    /* Viewlet.send */ 3024,
    /* id */ 'QuickPick',
    'focusIndex',
    0,
    0,
  ])
})

test('focusPrevious', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })

  await QuickPick.focusPrevious()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    /* Viewlet.send */ 3024,
    /* id */ 'QuickPick',
    /* method */ 'focusIndex',
    0,
    0,
  ])
})

test('focusNext', async () => {
  // TODO focused state should be in renderer-worker, not in renderer-process
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })

  await QuickPick.focusNext()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    /* Viewlet.send */ 3024,
    'QuickPick',
    'focusIndex',
    0,
    0,
  ])
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await QuickPick.show('', mockProvider1)

  await QuickPick.show('', mockProvider2)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    3024,
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
    '',
  ])
})
