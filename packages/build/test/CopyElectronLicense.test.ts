import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Copy/Copy.ts', () => ({
  copyFile: jest.fn(),
}))

const CopyElectronLicense = await import('../src/parts/CopyElectronLicense/CopyElectronLicense.ts')
const Copy = await import('../src/parts/Copy/Copy.ts')

test('copyElectronLicense copies the license into the Electron app root', async () => {
  await CopyElectronLicense.copyElectronLicense({
    resourcesPath: 'packages/build/.tmp/electron-bundle/x64/resources',
  })

  expect(Copy.copyFile).toHaveBeenCalledWith({
    from: 'LICENSE',
    to: 'packages/build/.tmp/electron-bundle/x64/resources/app/LICENSE',
  })
})
