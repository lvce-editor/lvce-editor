import { jest } from '@jest/globals'
import * as QuickPickFile from '../src/parts/QuickPick/QuickPickFile.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

test('name', () => {
  expect(QuickPickFile.name).toBe('file')
})

test('getPlaceholder', () => {
  expect(QuickPickFile.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickFile.getHelpEntries()).toEqual([
    {
      category: 'global commands',
      description: 'Go to file',
    },
  ])
})

test('getNoResults', () => {
  expect(QuickPickFile.getNoResults()).toEqual({
    label: 'No matching results',
  })
})

test('getPicks', async () => {
  await expect(QuickPickFile.getPicks()).resolves.toEqual([])
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
    await QuickPickFile.selectPick({
      label: 'test-file-1.txt',
    })
  ).toEqual({
    command: 'hide',
  })
})
