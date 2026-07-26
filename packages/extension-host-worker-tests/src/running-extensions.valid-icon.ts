import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.valid-icon'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-rich'
  await activateFixture(api, id, 'onCommand:runningExtensions.rich')
  const row = await getRunningExtension(api, id)
  const iconUrl = new URL(`../fixtures/${id}/icon.svg`, import.meta.url).href

  await api.expect(row.locator('img.RunningExtensionIcon')).toHaveAttribute('src', iconUrl)
}
