import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/JsonFile/JsonFile.js', () => ({
  writeJson: jest.fn(),
}))

const AddRootPackageJson = await import('../src/parts/AddRootPackageJson/AddRootPackageJson.js')
const JsonFile = await import('../src/parts/JsonFile/JsonFile.js')

test('addRootPackageJson - includes stable linux desktop name', async () => {
  await AddRootPackageJson.addRootPackageJson({
    cachePath: '/test/cache',
    electronVersion: '44.0.0-alpha.2',
    product: {
      applicationName: 'lvce-oss',
      nameLong: 'Lvce Editor - OSS',
    },
    bundleMainProcess: true,
    version: '1.0.0',
  })

  expect(JsonFile.writeJson).toHaveBeenCalledWith({
    to: '/test/cache/package.json',
    value: {
      name: 'lvce-oss',
      productName: 'Lvce Editor - OSS',
      desktopName: 'lvce-oss.desktop',
      version: '1.0.0',
      electronVersion: '44.0.0-alpha.2',
      type: 'module',
      main: 'packages/main-process/dist/mainProcessMain.js',
    },
  })
})
