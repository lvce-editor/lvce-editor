import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('node:fs/promises', () => ({
  readdir: jest.fn(async () => ['add.svg', 'close.svg']),
}))

jest.unstable_mockModule('../src/parts/CodiconsPath/CodiconsPath.ts', () => ({
  codiconsIconsPath: '/test/codicons/icons',
}))

jest.unstable_mockModule('../src/parts/Copy/Copy.ts', () => ({
  copy: jest.fn(),
}))

const CopyElectronIcons = await import('../src/parts/CopyElectronIcons/CopyElectronIcons.ts')
const Copy = await import('../src/parts/Copy/Copy.ts')

test('copies Electron icons only to the commit-scoped directory', async () => {
  await CopyElectronIcons.copyElectronIcons({
    resourcesPath: '/test/resources',
    commitHash: 'abc1234',
  })

  expect(Copy.copy).toHaveBeenCalledTimes(2)
  expect(Copy.copy).toHaveBeenNthCalledWith(1, {
    from: '/test/codicons/icons',
    to: '/test/resources/app/static/abc1234/icons',
  })
  expect(Copy.copy).toHaveBeenNthCalledWith(2, {
    from: 'static/icons',
    to: '/test/resources/app/static/abc1234/icons',
    ignore: ['add.svg', 'close.svg'],
  })
})
