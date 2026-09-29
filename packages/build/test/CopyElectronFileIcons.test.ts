import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Copy/Copy.ts', () => ({
  copy: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Remove/Remove.ts', () => ({
  remove: jest.fn(),
}))

const CopyElectronFileIcons = await import('../src/parts/CopyElectronFileIcons/CopyElectronFileIcons.ts')
const Copy = await import('../src/parts/Copy/Copy.ts')
const Remove = await import('../src/parts/Remove/Remove.ts')

test('copyElectronFileIcons moves vscode-icons into the commit-scoped file-icons directory', async () => {
  await CopyElectronFileIcons.copyElectronFileIcons({
    commitHash: 'abc123',
    resourcesPath: 'packages/build/.tmp/electron-bundle/x64/resources',
  })

  const vscodeIconsPath = 'packages/build/.tmp/electron-bundle/x64/resources/app/static/abc123/extensions/builtin.vscode-icons/icons'
  expect(Copy.copy).toHaveBeenCalledWith({
    from: vscodeIconsPath,
    to: 'packages/build/.tmp/electron-bundle/x64/resources/app/static/abc123/file-icons',
  })
  expect(Remove.remove).toHaveBeenCalledWith(vscodeIconsPath)
})
