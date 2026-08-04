import { beforeEach, expect, jest, test } from '@jest/globals'

const mainAreaWorkerInvoke = jest.fn()
const rendererProcessInvoke = jest.fn()

jest.unstable_mockModule('../src/parts/MainAreaWorker/MainAreaWorker.js', () => ({
  invoke: mainAreaWorkerInvoke,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: rendererProcessInvoke,
}))

const { renderMainAreaPending } = await import('../src/parts/RenderMainAreaPending/RenderMainAreaPending.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('renders the pending main area state', async () => {
  const diffResult = [1, 2]
  const commands = [['Viewlet.setDom2', 7, ['content']]]
  mainAreaWorkerInvoke.mockImplementation((method) => {
    if (method === 'MainArea.diff2') {
      return diffResult
    }
    if (method === 'MainArea.render2') {
      return commands
    }
    throw new Error(`unexpected method ${method}`)
  })

  await renderMainAreaPending(7)

  expect(mainAreaWorkerInvoke).toHaveBeenNthCalledWith(1, 'MainArea.diff2', 7)
  expect(mainAreaWorkerInvoke).toHaveBeenNthCalledWith(2, 'MainArea.render2', 7, diffResult)
  expect(rendererProcessInvoke).toHaveBeenCalledWith('Viewlet.sendMultiple', commands)
})

test('does not render when the pending state has no diff', async () => {
  mainAreaWorkerInvoke.mockImplementation(() => [])

  await renderMainAreaPending(7)

  expect(mainAreaWorkerInvoke).toHaveBeenCalledTimes(1)
  expect(rendererProcessInvoke).not.toHaveBeenCalled()
})
