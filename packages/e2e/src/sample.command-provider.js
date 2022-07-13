import { expect, runWithExtension, test } from './_testFrameWork.js'

test.skip('sample.command-provider', async () => {
  const page = await runWithExtension({
    name: 'sample.command-provider',
  })
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('.InputBox')
  await expect(quickPickInput).toHaveValue('>')
  await quickPickInput.type('Command Provider')
  const quickPickItemSampleCommand = quickPick.locator(
    'text=Command Provider: Sample Command'
  )
  await quickPickItemSampleCommand.click()
})
