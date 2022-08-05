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

const QuickPickFile = await import('../src/parts/QuickPick/QuickPickFile.js')
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

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
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    return 'sample text'
  })
  expect(
    await QuickPickFile.selectPick({
      label: 'test-file-1.txt',
    })
  ).toEqual({
    command: 'hide',
  })
})
