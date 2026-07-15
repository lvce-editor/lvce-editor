import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GetLicenseUri/GetLicenseUri.js', () => ({
  getLicenseUri: jest.fn(() => 'file:///test/LICENSE'),
}))

jest.unstable_mockModule('../src/parts/OpenUri/OpenUri.js', () => ({
  openUri: jest.fn(),
}))

const GetLicenseUri = await import('../src/parts/GetLicenseUri/GetLicenseUri.js')
const OpenUri = await import('../src/parts/OpenUri/OpenUri.js')
const License = await import('../src/parts/License/License.js')

test('openLicense', async () => {
  await License.openLicense()
  expect(GetLicenseUri.getLicenseUri).toHaveBeenCalledTimes(1)
  expect(OpenUri.openUri).toHaveBeenCalledWith('file:///test/LICENSE')
})
