import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(method: string, ...args: readonly unknown[]) => Promise<unknown>>()

jest.unstable_mockModule('../src/parts/SourceControlWorker/SourceControlWorker.js', () => ({
  invoke,
}))

const ViewletSourceControlResize = await import('../src/parts/ViewletSourceControl/ViewletSourceControlResize.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('resize updates the source control worker viewport and renders the input height', async () => {
  const dimensions = { height: 600, width: 240 }
  const commands = [['Viewlet.setCss', 7, '--SourceControlInputHeight: 60px']]
  invoke.mockImplementation(async (method) => {
    if (method === 'SourceControl.diff2') {
      return [10]
    }
    if (method === 'SourceControl.render2') {
      return commands
    }
    return undefined
  })
  const state = { commands: [], height: 400, uid: 7, width: 300 }

  await expect(ViewletSourceControlResize.resize(state, dimensions)).resolves.toEqual({ ...state, ...dimensions, commands })
  expect(invoke).toHaveBeenNthCalledWith(1, 'SourceControl.handleResize', 7, dimensions)
  expect(invoke).toHaveBeenNthCalledWith(2, 'SourceControl.diff2', 7)
  expect(invoke).toHaveBeenNthCalledWith(3, 'SourceControl.render2', 7, [10])
})

test('resize skips rendering when the source control viewport has no changes', async () => {
  invoke.mockImplementation(async (method) => (method === 'SourceControl.diff2' ? [] : undefined))
  const state = { commands: [], height: 400, uid: 7, width: 300 }
  const dimensions = { height: 400, width: 300 }

  await expect(ViewletSourceControlResize.resize(state, dimensions)).resolves.toBe(state)
  expect(invoke).toHaveBeenCalledTimes(2)
})
