import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

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

const ExtensionHostDiagnostic = await import(
  '../src/parts/ExtensionHost/ExtensionHostDiagnostic.js'
)

const EditorDiagnostics = await import(
  '../src/parts/EditorDiagnostics/EditorDiagnostics.js'
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
  RendererProcess.state.send = jest.fn()
  await EditorDiagnostics.runDiagnostics(editor)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
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
    ],
  ])
})

test.skip('scheduleDiagnostics - error', () => {})
