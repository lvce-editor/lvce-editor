import { expect, test } from '@jest/globals'
import * as GetExtensionAbsolutePath from '../src/parts/GetExtensionAbsolutePath/GetExtensionAbsolutePath.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

test('getExtensionAbsolutePath handles file urls for local extensions', () => {
  const absolutePath = GetExtensionAbsolutePath.getExtensionAbsolutePath(
    'builtin.git',
    false,
    false,
    'file:///D:/a/git/git/packages/extension',
    'src/gitMain.js',
    'http://localhost:3000',
    PlatformType.Electron,
  )

  expect(absolutePath).toBe('http://localhost:3000/remote/D:/a/git/git/packages/extension/src/gitMain.js')
})

test.each([
  '/usr/lib/lvce/resources/app/static/2d0c8e6/extensions/builtin.pull-request-github',
  '/usr/lib/lvce/resources/app/static/2d0c8e6/extensions/builtin.pull-request-github/',
  'C:\\Program Files\\LVCE\\resources\\app\\static\\2d0c8e6\\extensions\\builtin.pull-request-github',
])('resolves bundled GitHub view CSS from its directory: %s', (path) => {
  const absolutePath = GetExtensionAbsolutePath.getExtensionAbsolutePath(
    'github.pull-requests',
    false,
    true,
    path,
    'media/pullRequests.css',
    'lvce://-',
    PlatformType.Electron,
  )
  expect(absolutePath).toBe('/extensions/builtin.pull-request-github/media/pullRequests.css')
})

test('falls back to the builtin id when the directory is omitted', () => {
  expect(
    GetExtensionAbsolutePath.getExtensionAbsolutePath('builtin.sample', false, true, '', 'media/view.css', 'lvce://-', PlatformType.Electron),
  ).toBe('/extensions/builtin.sample/media/view.css')
})
