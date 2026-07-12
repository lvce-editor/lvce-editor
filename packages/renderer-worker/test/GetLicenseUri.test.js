import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const GetLicenseUri = await import('../src/parts/GetLicenseUri/GetLicenseUri.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('web', async () => {
  const uri = await GetLicenseUri.getLicenseUri(PlatformType.Web, '/abc123')
  expect(uri).toBe('/abc123/LICENSE')
  expect(SharedProcess.invoke).not.toHaveBeenCalled()
})

test('electron', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockResolvedValue('file:///opt/lvce-editor')
  const uri = await GetLicenseUri.getLicenseUri(PlatformType.Electron, '')
  expect(uri).toBe('file:///opt/lvce-editor/LICENSE')
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Platform.getRootUri')
})

test('remote', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockResolvedValue('file:///home/test/lvce-editor/')
  const uri = await GetLicenseUri.getLicenseUri(PlatformType.Remote, '')
  expect(uri).toBe('file:///home/test/lvce-editor/LICENSE')
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Platform.getRootUri')
})
