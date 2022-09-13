import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostDiagnostic.js',
  () => {
    return {
      executeDiagnosticProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
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

const ExtensionHostDiagnostic = await import(
  '../src/parts/ExtensionHost/ExtensionHostDiagnostic.js'
)

const EditorDiagnostics = await import(
  '../src/parts/EditorDiagnostics/EditorDiagnostics.js'
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

test('scheduleDiagnostics', async () => {
  const editor = {
    id: 1,
    lines: ['line 1', 'line 2'],
    minLineY: 0,
    maxLineY: 20,
    rowHeight: 20,
    columnWidth: 8,
    height: 400,
  }
  // @ts-ignore
  ExtensionHostDiagnostic.executeDiagnosticProvider.mockImplementation(() => {
    return [
      {
        rowIndex: 1,
        columnIndex: 0,
        message: 'assignment not allowed',
      },
    ]
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorDiagnostics.runDiagnostics(editor)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    770,
    1,
    // TODO this should be intarray for efficiency -> binary search visible diagnostics (get length) -> allocate uint8array -> flatmap visible diagnostic to numbers

    [
      {
        top: 20,
        left: 0,
        width: 20,
        height: 20,
        type: undefined,
      },
    ],
    // TODO this should also be int array for efficiency
    [
      {
        height: 2,
        top: 200,
      },
    ]
  )
})

test.skip('scheduleDiagnostics - error', () => {})
