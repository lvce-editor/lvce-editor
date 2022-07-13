import { expect, runWithExtension, test } from './_testFrameWork.js'

test.skip('sample.command-provider-without-activation', async () => {
  const page = await runWithExtension({
    name: 'sample.command-provider-without-activation',
  })
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('.InputBox')
  await expect(quickPickInput).toBeVisible()
  await expect(quickPickInput).toHaveValue('>')
  await quickPickInput.type('Command Provider')
  const quickPickItemSampleCommand = quickPick.locator(
    'text=Command Provider: Sample Command'
  )
  await quickPickItemSampleCommand.click()
  const dialog = page.locator('#Dialog')
  await expect(dialog).toBeVisible()
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  // TODO should improve error message that no extension has been activated for command
  // and that probably activationEvents should be adjusted
  await expect(errorMessage).toHaveText(
    `Error: Extension Command "command-provider.sampleCommand" not found. Please try to register the command with \`vscode.registerCommand(myCommand)\``
  )
})
