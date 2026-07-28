import { beforeEach, expect, jest, test } from '@jest/globals'

const ViewletExplorer = await import('../src/parts/ViewletExplorer/ViewletExplorer.js')
const invoke = jest.fn<(method: string, ...args: readonly unknown[]) => Promise<unknown>>()

beforeEach(() => {
  jest.resetAllMocks()
})

test('resize updates the explorer worker viewport and renders newly visible items', async () => {
  const dimensions = {
    height: 600,
    width: 240,
    x: 0,
    y: 0,
  }
  const commands = [['Viewlet.setPatches', 7, [['add', 24]]]]
  invoke.mockImplementation(async (method) => {
    if (method === 'Explorer.diff2') {
      return [1]
    }
    if (method === 'Explorer.render2') {
      return commands
    }
    return undefined
  })
  const state = {
    commands: [],
    height: 400,
    uid: 7,
    width: 240,
    x: 0,
    y: 0,
  }

  const result = await ViewletExplorer.resizeWithDependencies(state, dimensions, invoke)

  expect(invoke).toHaveBeenNthCalledWith(1, 'Explorer.handleResize', 7, dimensions)
  expect(invoke).toHaveBeenNthCalledWith(2, 'Explorer.diff2', 7)
  expect(invoke).toHaveBeenNthCalledWith(3, 'Explorer.render2', 7, [1])
  expect(result).toEqual({
    ...state,
    ...dimensions,
    commands,
  })
})

test('resize skips rendering when the explorer viewport has no changes', async () => {
  invoke.mockImplementation(async (method) => {
    if (method === 'Explorer.diff2') {
      return []
    }
    return undefined
  })
  const state = {
    commands: [],
    height: 400,
    uid: 7,
    width: 240,
  }
  const dimensions = {
    height: 400,
    width: 240,
  }

  const result = await ViewletExplorer.resizeWithDependencies(state, dimensions, invoke)

  expect(invoke).toHaveBeenCalledTimes(2)
  expect(result).toEqual(state)
})
