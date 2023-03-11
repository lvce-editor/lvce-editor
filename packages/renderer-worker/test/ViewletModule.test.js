import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ViewletModuleInternal/ViewletModuleInternal.js', () => {
  return {
    load: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js', () => {
  return {
    tryToGetActualImportErrorMessage: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletModule = await import('../src/parts/ViewletModule/ViewletModule.js')
const ViewletModuleInternal = await import('../src/parts/ViewletModuleInternal/ViewletModuleInternal.js')
const TryToGetActualImportErrorMessage = await import('../src/parts/TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js')

test('load - import error - dependency not found', async () => {
  // @ts-ignore
  ViewletModuleInternal.load.mockImplementation(() => {
    throw new TypeError(`Failed to fetch dynamically imported module: test:///packages/renderer-worker/src/parts/ViewletMain/ViewletMain.ipc.js`)
  })
  // @ts-ignore
  TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage.mockImplementation(() => {
    throw new Error(`DependencyNotFoundError: module not found "../GetEditorSplitDirectionType/GetEditorSplitDirectionType.js"`)
  })
  await expect(ViewletModule.load(123)).rejects.toThrowError(
    new Error('DependencyNotFoundError: module not found "../GetEditorSplitDirectionType/GetEditorSplitDirectionType.js"')
  )
})

test('load - import error', async () => {
  // @ts-ignore
  ViewletModuleInternal.load.mockImplementation(() => {
    throw new TypeError(`x is not a function`)
  })
  await expect(ViewletModule.load(123)).rejects.toThrowError(new TypeError('x is not a function'))
})

test('load - syntax error', async () => {
  // @ts-ignore
  ViewletModuleInternal.load.mockImplementation(() => {
    throw new SyntaxError("Failed to import script: SyntaxError: Unexpected token '<<'")
  })
  // @ts-ignore
  TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage.mockImplementation(() => {
    return `Failed to import script: SyntaxError: Unexpected token '<<'"`
  })
  await expect(ViewletModule.load(123)).rejects.toThrowError(
    "Failed to load 123 module: Failed to import script: SyntaxError: Unexpected token '<<'\""
  )
})
