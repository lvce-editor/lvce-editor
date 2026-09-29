import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.ts', () => ({
  invoke: jest.fn(),
}))

const MainProcess = await import('../src/parts/MainProcess/MainProcess.ts')
const ElectronProcess = await import('../src/parts/ElectronProcess/ElectronProcess.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('getArgv', async () => {
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(['/usr/bin/lvce', '--prompt', 'Fix the tests'])
  await expect(ElectronProcess.getArgv()).resolves.toEqual(['/usr/bin/lvce', '--prompt', 'Fix the tests'])
  expect(MainProcess.invoke).toHaveBeenCalledWith('Process.getArgv')
})

test('writeStdout', async () => {
  await ElectronProcess.writeStdout('Done\n')
  expect(MainProcess.invoke).toHaveBeenCalledWith('Process.writeStdout', 'Done\n')
})

test('writeStderr', async () => {
  await ElectronProcess.writeStderr('Failed\n')
  expect(MainProcess.invoke).toHaveBeenCalledWith('Process.writeStderr', 'Failed\n')
})
