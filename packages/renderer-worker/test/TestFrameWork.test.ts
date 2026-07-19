import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const TestFrameWork = await import('../src/parts/TestFrameWork/TestFrameWork.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('checkSingleElementCondition checks once and returns the first result', async () => {
  const locator = { selector: '.Test' }
  const options = { text: 'Hello' }
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValueOnce({ error: true })
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValueOnce({ error: false })

  await expect(TestFrameWork.checkSingleElementCondition(locator, 'toHaveText', options)).resolves.toEqual({ error: true })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('TestFrameWork.checkSingleElementCondition', locator, 'toHaveText', options)
})

test('checkMultiElementCondition checks once and returns the first result', async () => {
  const locator = { selector: '.Test' }
  const options = { count: 2 }
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValueOnce({ error: true })
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValueOnce({ error: false })

  await expect(TestFrameWork.checkMultiElementCondition(locator, 'toHaveCount', options)).resolves.toEqual({ error: true })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('TestFrameWork.checkMultiElementCondition', locator, 'toHaveCount', options)
})
