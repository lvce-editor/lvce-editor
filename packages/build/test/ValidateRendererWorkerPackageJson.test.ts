import { expect, test } from '@jest/globals'
import { validatePackageJson } from '../src/parts/ValidateRendererWorkerPackageJson/ValidateRendererWorkerPackageJson.ts'

test('accepts npm dependency versions', () => {
  expect(() =>
    validatePackageJson({
      dependencies: {
        '@lvce-editor/text-search-view': '^1.6.5',
      },
    }),
  ).not.toThrow()
})

test.each([
  'https://github.com/lvce-editor/text-search-view/releases/download/v1.6.5/lvce-editor-text-search-view-1.6.5.tgz',
  'https://github.com/lvce-editor/text-search-view/archive/refs/tags/v1.6.5.tar.gz',
])('rejects GitHub tarball dependency %s', (version) => {
  expect(() =>
    validatePackageJson({
      dependencies: {
        '@lvce-editor/text-search-view': version,
      },
    }),
  ).toThrow('must use an npm version instead of a GitHub tarball')
})

test('checks every dependency section', () => {
  expect(() =>
    validatePackageJson({
      devDependencies: {
        '@lvce-editor/text-search-view': 'https://github.com/lvce-editor/text-search-view/releases/download/v1.6.5/text-search-view.tgz',
      },
    }),
  ).toThrow('must use an npm version instead of a GitHub tarball')
})
