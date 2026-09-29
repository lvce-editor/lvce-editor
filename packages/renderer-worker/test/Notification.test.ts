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

test.each([0, 1, undefined])('showWithOptions returns the renderer choice %s', async (choice) => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(choice)
  const result = await Notification.showWithOptions('info', 'There are no changes to commit', ['Create Empty Commit'])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Notification.showWithOptions', 'info', 'There are no changes to commit', [
    'Create Empty Commit',
  ])
  expect(result).toBe(choice)
})
