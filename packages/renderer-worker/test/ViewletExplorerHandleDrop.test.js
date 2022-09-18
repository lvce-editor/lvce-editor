import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDropRoot.js',
  () => {
    return {
      handleDropRoot: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ViewletExplorerHandleDrop = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDrop.js'
)
const ViewletExplorerHandleDropRoot = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDropRoot.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)
test('handleDrop - error', async () => {
  // @ts-ignore
  ViewletExplorerHandleDropRoot.handleDropRoot.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  const state = {
    ...ViewletExplorer.create(),
    top: 0,
    height: 0,
  }
  await expect(
    ViewletExplorerHandleDrop.handleDrop(state, 0, 0, [])
  ).rejects.toThrowError(
    new Error('Failed to drop files: TypeError: x is not a function')
  )
})
