import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

const MainProcess = await import('../src/parts/MainProcess/MainProcess.js')
const SendMessagePortToMainProcess = await import('../src/parts/SendMessagePortToMainProcess/SendMessagePortToMainProcess.js')

test('sendMessagePortToMainProcess', async () => {
  const port = {}

  await SendMessagePortToMainProcess.sendMessagePortToMainProcess(port, 'HandleMessagePort.handleMessagePort', 42)

  expect(MainProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(MainProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', port, 42)
})
