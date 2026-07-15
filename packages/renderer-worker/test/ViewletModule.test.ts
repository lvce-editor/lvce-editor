import { beforeEach, expect, jest, test } from '@jest/globals'

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

const ViewletModule = await import('../src/parts/ViewletModule/ViewletModule.js')
const ViewletModuleInternal = await import('../src/parts/ViewletModuleInternal/ViewletModuleInternal.js')

test('load - import error - dependency not found', async () => {
  // @ts-ignore
  ViewletModuleInternal.load.mockImplementation(() => {
    throw new TypeError('Failed to fetch dynamically imported module: test:///packages/renderer-worker/src/parts/ViewletMain/ViewletMain.ipc.js')
  })
  await expect(ViewletModule.load(123)).rejects.toThrow(
    new Error(
      `Failed to load 123 module: TypeError: Failed to fetch dynamically imported module: test:///packages/renderer-worker/src/parts/ViewletMain/ViewletMain.ipc.js`,
    ),
  )
})

test('load - import error', async () => {
  // @ts-ignore
  ViewletModuleInternal.load.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ViewletModule.load(123)).rejects.toThrow(new TypeError('x is not a function'))
})

test('load - syntax error', async () => {
  // @ts-ignore
  ViewletModuleInternal.load.mockImplementation(() => {
    throw new SyntaxError("Failed to import script: SyntaxError: Unexpected token '<<'")
  })
  // @ts-ignore
  await expect(ViewletModule.load(123)).rejects.toThrow(
    "Failed to load 123 module: SyntaxError: Failed to import script: SyntaxError: Unexpected token '<<'",
  )
})
