import { runWithExtension, test, expect } from './_testFrameWork.js'

test.skip('sample.command-provider-error-not-registered-in-js', async () => {
  const page = await runWithExtension({
    name: 'sample.command-provider-error-not-registered-in-js',
  })
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('.InputBox')
  await expect(quickPickInput).toHaveValue('>')
  await quickPickInput.type('sample')
  const quickPickItemSampleCommand = quickPick.locator('text=sample')
  await quickPickItemSampleCommand.click()
  // TODO assert that message is shown: command not found
})
