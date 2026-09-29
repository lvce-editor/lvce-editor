import { expect, test } from '@jest/globals'
import { getIconThemeEtag } from '../src/parts/GetIconThemeEtag/GetIconThemeEtag.ts'

test('computes a stable etag from the icon theme contents', async () => {
  const etag = await getIconThemeEtag({ iconThemePath: 'packages/build/test/fixtures/icon-theme.json' })

  expect(etag).toBe('4c0017dd1a7f8d1806173fb908ea3a7baf4fd64e')
})

test('computes the etag after applying the production icon path', async () => {
  const etag = await getIconThemeEtag({ iconThemePath: 'packages/build/test/fixtures/icon-theme.json', iconPath: '/file-icons' })

  expect(etag).toBe('8e2de3f6057a56b20eff7ffbbb099bf7453d131c')
})
