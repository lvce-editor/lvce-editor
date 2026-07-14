import { beforeEach, expect, jest, test } from '@jest/globals'
import { pathToFileURL } from 'node:url'

jest.unstable_mockModule('../src/parts/IsElectron/IsElectron.js', () => ({
  isElectron: true,
}))

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(),
}))

const MainProcess = await import('../src/parts/MainProcess/MainProcess.js')
const ResolveRoot = await import('../src/parts/ResolveRoot/ResolveRoot.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('resolveRoot - resolves dot from packaged app arguments', async () => {
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(['/usr/lib/lvce-oss/lvce-oss', '.'])

  const resolvedRoot = await ResolveRoot.resolveRoot()

  expect(resolvedRoot).toMatchObject({
    path: process.cwd(),
    source: 'shared-process-cli-arg',
    uri: pathToFileURL(process.cwd()).toString(),
  })
})

test('resolveRoot - resolves dot from development electron arguments', async () => {
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(['/test/dist/electron', '/test/app', '.'])

  const resolvedRoot = await ResolveRoot.resolveRoot()

  expect(resolvedRoot).toMatchObject({
    path: process.cwd(),
    source: 'shared-process-cli-arg',
    uri: pathToFileURL(process.cwd()).toString(),
  })
})

test('resolveRoot - uses cwd in prompt mode', async () => {
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(['/usr/lib/lvce-oss/lvce-oss', '--prompt', 'Fix the tests'])

  const resolvedRoot = await ResolveRoot.resolveRoot()

  expect(resolvedRoot).toMatchObject({
    path: process.cwd(),
    source: 'shared-process-cli-arg',
    uri: pathToFileURL(process.cwd()).toString(),
  })
})
