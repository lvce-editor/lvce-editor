import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const QuickPickEntriesEverything = await import(
  '../src/parts/QuickPickEntriesEverything/QuickPickEntriesEverything.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

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
}

test('name', () => {
  expect(QuickPickEntriesEverything.name).toBe('everything')
})

test('getPlaceholder', () => {
  // TODO fix tsc
  // @ts-ignore
  QuickPickEntriesEverything.state.provider = mockProvider
  expect(QuickPickEntriesEverything.getPlaceholder()).toBe('mock placeholder')
})

test('getHelpEntries', () => {
  expect(QuickPickEntriesEverything.getHelpEntries()).toEqual([
    {
      category: 'mock commands',
      description: 'mock help entry',
    },
  ])
})

test('getNoResults', () => {
  expect(QuickPickEntriesEverything.getNoResults()).toEqual({
    label: 'mock no result',
  })
})

test('getPicks', async () => {
  await expect(QuickPickEntriesEverything.getPicks('')).resolves.toEqual([])
})

test('selectPick', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 101:
        return 'sample text'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(
    await QuickPickEntriesEverything.selectPick({
      label: 'test-file-1.txt',
    })
  ).toEqual({
    command: 'hide',
  })
})

// TODO test potential race conditions
