import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const Crash = await import('../src/parts/Crash/Crash.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

test('crashSharedProcess', async () => {
  await Crash.crashSharedProcess()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Crash.crashSharedProcess')
})
