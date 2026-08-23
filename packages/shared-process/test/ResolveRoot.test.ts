import { beforeEach, expect, jest, test } from '@jest/globals'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

jest.unstable_mockModule('../src/parts/IsElectron/IsElectron.js', () => ({
  isElectron: true,
}))

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/IsProduction/IsProduction.js', () => ({
  isProduction: true,
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

test('resolveRoot - resolves the workspace for a second window', async () => {
  const workspacePath = resolve('test', 'second-workspace')
  const workspaceUri = pathToFileURL(workspacePath).toString()
  const url = new URL('lvce-oss://-/')
  url.searchParams.set('workspace', workspaceUri)

  const resolvedRoot = await ResolveRoot.resolveRoot(url.toString())

  expect(resolvedRoot).toMatchObject({
    path: workspacePath,
    source: 'shared-process-cli-arg',
    uri: workspaceUri,
  })
  expect(MainProcess.invoke).not.toHaveBeenCalled()
})

test('resolveRoot - preserves a remote workspace uri for a second window', async () => {
  const workspaceUri = 'remote-ssh://user@example.com:2222/home'
  const url = new URL('lvce-oss://-/')
  url.searchParams.set('workspace', workspaceUri)

  const resolvedRoot = await ResolveRoot.resolveRoot(url.toString())

  expect(resolvedRoot).toMatchObject({
    path: workspaceUri,
    pathSeparator: '/',
    source: 'shared-process-cli-arg',
    uri: workspaceUri,
  })
  expect(MainProcess.invoke).not.toHaveBeenCalled()
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

test('resolveRoot - starts with an empty workspace in production electron', async () => {
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue(['/usr/lib/lvce-oss/lvce-oss'])

  const resolvedRoot = await ResolveRoot.resolveRoot()

  expect(resolvedRoot).toMatchObject({
    path: '',
    source: 'shared-process-env',
    uri: '',
  })
})
