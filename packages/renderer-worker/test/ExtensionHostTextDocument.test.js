import { jest } from '@jest/globals'

afterEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostCore.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
      activateByEvent: jest.fn(() => {}),
    }
  }
)

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostManagement.js',
  () => {
    return {
      activateByEvent: jest.fn(),
      ensureExtensionHostIsStarted: jest.fn(),
    }
  }
)

const ExtensionHostTextDocument = await import(
  '../src/parts/ExtensionHost/ExtensionHostTextDocument.js'
)

const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('handleEditorCreate', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {})
  await ExtensionHostTextDocument.handleEditorCreate({
    lines: ['1', '2', '3'],
    languageId: 'javascript',
  })
  expect(ExtensionHost.invoke).toHaveBeenCalledTimes(1)
  expect(ExtensionHost.invoke).toHaveBeenCalledWith(
    'ExtensionHostTextDocument.syncFull',
    undefined,
    undefined,
    'javascript',
    `1\n2\n3`
  )
})

test('handleEditorLanguageChange', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {})
  await ExtensionHostTextDocument.handleEditorLanguageChange({
    lines: ['1', '2', '3'],
    languageId: 'javascript',
    id: 1,
  })
  expect(ExtensionHost.invoke).toHaveBeenCalledTimes(1)
  expect(ExtensionHost.invoke).toHaveBeenCalledWith(
    'ExtensionHostTextDocument.setLanguageId',
    1,
    'javascript'
  )
})

test('handleEditorChange', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {})
  await ExtensionHostTextDocument.handleEditorChange(
    {
      lines: ['1', '2', '3'],
      languageId: 'javascript',
      id: 1,
    },
    []
  )
  expect(ExtensionHost.invoke).toHaveBeenCalledTimes(1)
  expect(ExtensionHost.invoke).toHaveBeenCalledWith(
    'ExtensionHostTextDocument.syncIncremental',
    1,
    []
  )
})
