import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Notification/Notification.js', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Timestamp/Timestamp.js', () => ({
  now: jest.fn(),
}))

const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const MeasureExtensionManagementWorkerLatency =
  await import('../src/parts/MeasureExtensionManagementWorkerLatency/MeasureExtensionManagementWorkerLatency.js')
const Notification = await import('../src/parts/Notification/Notification.js')
const Timestamp = await import('../src/parts/Timestamp/Timestamp.js')
const now = /** @type {jest.Mock} */ (Timestamp.now)

beforeEach(() => {
  jest.resetAllMocks()
})

test('measures the average latency of 100 messages after warming up the worker', async () => {
  now.mockReturnValueOnce(10).mockReturnValueOnce(35)

  await expect(MeasureExtensionManagementWorkerLatency.measureExtensionManagementWorkerLatency()).resolves.toBe(0.25)

  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledTimes(101)
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.handleData')
  expect(Notification.create).toHaveBeenCalledWith('info', 'Average extension management worker latency over 100 messages: 0.25ms')
})
