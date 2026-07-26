import type { Test } from '@lvce-editor/test-with-playwright'
import { activateLiveViewExtension, addLiveViewExtension } from '../fixtures/sample.running-extensions-live-view/test.js'

export const name = 'running-extensions.live-view-row-count'

export const test: Test = async ({ expect, Locator, RunningExtensions, ...api }) => {
  await addLiveViewExtension(api)
  await RunningExtensions.show()
  const rows = Locator('.RunningExtension')
  await expect(rows).toHaveCount(1)

  await activateLiveViewExtension({ expect, Locator, ...api })

  await expect(rows).toHaveCount(2)
}
