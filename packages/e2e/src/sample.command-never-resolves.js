import { runWithExtension, test, expect } from './_testFrameWork.js'

test.skip('sample.command-never-resolves', async () => {
  const page = await runWithExtension({
    name: 'sample.command-never-resolves',
  })
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('input')
  await expect(quickPickInput).toHaveValue('>')

  await quickPickInput.type('Command Never Resolves')
  const quickPickItemCommand = page.locator('.QuickPickItem', {
    hasText: 'Command Never Resolves',
  })
  await quickPickItemCommand.click()
  // TODO check that error message is shown after some time
})
