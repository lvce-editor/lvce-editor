import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

const state = {
  platform: PlatformType.Remote,
}

beforeEach(() => {
  jest.clearAllMocks()
  state.platform = PlatformType.Remote
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform: jest.fn(() => state.platform),
  }
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const ContentSecurityPolicy = await import('../src/parts/ContentSecurityPolicy/ContentSecurityPolicy.js')

test('sets the content security policy on the remote server', async () => {
  await ContentSecurityPolicy.set('/remote/extensions/sample/main.js', `default-src 'none';`)

  expect(SharedProcess.invoke).toHaveBeenCalledWith('ContentSecurityPolicy.set', '/remote/extensions/sample/main.js', `default-src 'none';`)
})

test('sets the content security policy in Electron', async () => {
  state.platform = PlatformType.Electron

  await ContentSecurityPolicy.set('/extensions/sample/main.js', `default-src 'none';`)

  expect(SharedProcess.invoke).toHaveBeenCalledWith('ContentSecurityPolicy.set', '/extensions/sample/main.js', `default-src 'none';`)
})

test('does not set a dynamic content security policy for static web assets', async () => {
  state.platform = PlatformType.Web

  await ContentSecurityPolicy.set('/extensions/sample/main.js', `default-src 'none';`)

  expect(SharedProcess.invoke).not.toHaveBeenCalled()
})
