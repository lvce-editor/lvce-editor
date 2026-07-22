import { expect, test } from '@jest/globals'
import { Css } from '../src/parts/ViewletExtensionDetail/ViewletExtensionDetailCss.ts'

test('loads changelog styles', () => {
  expect(Css).toContain('/css/parts/Changelog.css')
})
