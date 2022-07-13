import { runWithExtension, expect, test } from './_testFrameWork.js'
import waitForExpect from 'wait-for-expect'

test.skip('sample.command-provider-error-command-null-in-extension-manifest', async () => {
  const page = await runWithExtension({
    name: 'sample.command-provider-error-command-null-in-extension-manifest',
  })
  await page.waitForLoadState('networkidle')
  /**
   * @type {any[]}
   */
  const errors = []
  page.on('pageerror', (error) => {
    errors.push(error)
  })
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('.InputBox')
  await expect(quickPickInput).toBeVisible()
  // TODO should filter out bad commands in extension host so that they don't appear here
  // this is a bad error message
  await waitForExpect(() => {
    expect(errors).toEqual([
      new TypeError(`Cannot read properties of null (reading 'label')`),
    ])
  })
})
