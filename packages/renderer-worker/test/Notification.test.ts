import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const Notification = await import('../src/parts/Notification/Notification.js')

test('create', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue('Notification-42')
  const id = await Notification.create('info', 'sample text')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Notification.create', 'info', 'sample text')
  expect(id).toBe('Notification-42')
})

test('dispose', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Notification.dispose(1)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Notification.dispose', 1)
})
