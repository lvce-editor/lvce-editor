import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const TestFrameWork = await import('../src/parts/TestFrameWork/TestFrameWork.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('checkSingleElementCondition retries until condition passes', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValueOnce({ error: true })
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValueOnce({ error: false })

  await expect(TestFrameWork.checkSingleElementCondition({ selector: '.Test' }, 'toBeVisible', { timeout: 100 })).resolves.toEqual({ error: false })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
})

test('checkSingleElementCondition returns last failed result after timeout', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue({ error: true })

  await expect(TestFrameWork.checkSingleElementCondition({ selector: '.Test' }, 'toBeVisible', { timeout: 0 })).resolves.toEqual({ error: true })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
})
