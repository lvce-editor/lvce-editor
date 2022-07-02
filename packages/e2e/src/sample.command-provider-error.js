import { runWithExtension, test, expect } from './_testFrameWork.js'

test('sample.command-provider-error', async () => {
  const page = await runWithExtension({
    name: 'sample.command-provider-error',
  })
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('input')
  await expect(quickPickInput).toHaveValue('>')
  await quickPickInput.type('Command Provider Error')
  const quickPickItemCommand = page.locator('.QuickPickItem', {
    hasText: 'Command Provider Error',
  })
  await quickPickItemCommand.click()
})
