import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform: jest.fn(() => {
      return PlatformType.Remote
    }),
    assetDir: '',
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const GetResolvedRoot = await import('../src/parts/GetResolvedRoot/GetResolvedRoot.js')

test('getResolvedRoot - prefers explicit cli workspace over session storage', async () => {
  const sessionWorkspace = {
    path: '/test/previous-workspace',
    uri: 'file:///test/previous-workspace',
    homeDir: '/home/test',
    pathSeparator: '/',
    source: 'session-storage',
  }
  const cliWorkspace = {
    path: '/test/cli-workspace',
    uri: 'file:///test/cli-workspace',
    homeDir: '/home/test',
    pathSeparator: '/',
    source: 'shared-process-cli-arg',
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return sessionWorkspace
  })
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return cliWorkspace
  })
  const resolvedRoot = await GetResolvedRoot.getResolvedRoot('http://localhost:3000')
  expect(resolvedRoot).toEqual(cliWorkspace)
})

test('getResolvedRoot - keeps session workspace when no cli workspace was provided', async () => {
  const sessionWorkspace = {
    path: '/test/previous-workspace',
    uri: 'file:///test/previous-workspace',
    homeDir: '/home/test',
    pathSeparator: '/',
    source: 'session-storage',
  }
  const defaultWorkspace = {
    path: '/test/playground',
    uri: 'file:///test/playground',
    homeDir: '/home/test',
    pathSeparator: '/',
    source: 'shared-process-default',
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return sessionWorkspace
  })
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return defaultWorkspace
  })
  const resolvedRoot = await GetResolvedRoot.getResolvedRoot('http://localhost:3000')
  expect(resolvedRoot).toEqual(sessionWorkspace)
})
