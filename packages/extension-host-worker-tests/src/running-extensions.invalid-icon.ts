import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.invalid-icon'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-invalid-icon'
  await activateFixture(api, id, 'onCommand:runningExtensions.invalidIcon')
  const row = await getRunningExtension(api, id)
  const icon = row.locator('img.RunningExtensionIcon')
  const iconUrl = new URL(`../fixtures/${id}/missing.svg`, import.meta.url).href

  await api.expect(icon).toHaveAttribute('src', iconUrl)
  await api.expect(icon).toHaveJSProperty('naturalWidth', 0)
}
