import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (method: string, ..._args: readonly unknown[]) => {
  if (method === 'Problems.diff2') {
    return [1, 2]
  }
  if (method === 'Problems.render2') {
    return [['Viewlet.setDom2', []]]
  }
  return undefined
})

jest.unstable_mockModule('../src/parts/ProblemsWorker/ProblemsWorker.ts', () => ({ invoke }))

const { resize } = await import('../src/parts/ViewletProblems/ViewletProblems.ipc.js')

beforeEach(() => {
  invoke.mockClear()
})

test('resize forwards current dimensions to the problems worker and renders the result', async () => {
  const state = {
    commands: [],
    height: 0,
    uid: 42,
    width: 0,
    x: 0,
    y: 0,
  }
  const dimensions = {
    height: 200,
    width: 800,
    x: 10,
    y: 20,
  }

  await expect(resize(state, dimensions)).resolves.toEqual({
    ...state,
    ...dimensions,
    commands: [['Viewlet.setDom2', []]],
  })
  expect(invoke).toHaveBeenNthCalledWith(1, 'Problems.resize', 42, dimensions)
  expect(invoke).toHaveBeenNthCalledWith(2, 'Problems.diff2', 42)
  expect(invoke).toHaveBeenNthCalledWith(3, 'Problems.render2', 42, [1, 2])
})
