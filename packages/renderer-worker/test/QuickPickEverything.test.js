import { jest } from '@jest/globals'
import * as QuickPickEverything from '../src/parts/QuickPick/QuickPickEverything.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

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
  expect(QuickPickEverything.name).toBe('everything')
})

test('getPlaceholder', () => {
  // TODO fix tsc
  // @ts-ignore
  QuickPickEverything.state.provider = mockProvider
  expect(QuickPickEverything.getPlaceholder()).toBe('mock placeholder')
})

test('getHelpEntries', () => {
  expect(QuickPickEverything.getHelpEntries()).toEqual([
    {
      category: 'mock commands',
      description: 'mock help entry',
    },
  ])
})

test('getNoResults', () => {
  expect(QuickPickEverything.getNoResults()).toEqual({
    label: 'mock no result',
  })
})

test('getPicks', async () => {
  await expect(QuickPickEverything.getPicks('')).resolves.toEqual([])
})

test('selectPick', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  expect(
    await QuickPickEverything.selectPick({
      label: 'test-file-1.txt',
    })
  ).toEqual({
    command: 'hide',
  })
})

// TODO test potential race conditions
