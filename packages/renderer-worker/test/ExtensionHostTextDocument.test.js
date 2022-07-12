import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      execute: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostTextDocument = await import(
  '../src/parts/ExtensionHost/ExtensionHostTextDocument.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('handleEditorCreate', async () => {
  // @ts-ignore
  ExtensionHostShared.execute.mockImplementation(() => {})
  await ExtensionHostTextDocument.handleEditorCreate({
    lines: ['1', '2', '3'],
    languageId: 'javascript',
  })
  expect(ExtensionHostShared.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.execute).toHaveBeenCalledWith({
    method: 'ExtensionHostTextDocument.syncFull',
    params: [undefined, undefined, 'javascript', '1\n2\n3'],
  })
})

test('handleEditorLanguageChange', async () => {
  // @ts-ignore
  ExtensionHostShared.execute.mockImplementation(() => {})
  await ExtensionHostTextDocument.handleEditorLanguageChange({
    lines: ['1', '2', '3'],
    languageId: 'javascript',
    id: 1,
  })
  expect(ExtensionHostShared.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.execute).toHaveBeenCalledWith({
    method: 'ExtensionHostTextDocument.setLanguageId',
    params: [1, 'javascript'],
  })
})

test('handleEditorChange', async () => {
  // @ts-ignore
  ExtensionHostShared.execute.mockImplementation(() => {})
  await ExtensionHostTextDocument.handleEditorChange(
    {
      lines: ['1', '2', '3'],
      languageId: 'javascript',
      id: 1,
    },
    []
  )
  expect(ExtensionHostShared.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.execute).toHaveBeenCalledWith({
    method: 'ExtensionHostTextDocument.syncIncremental',
    params: [1, []],
  })
})
