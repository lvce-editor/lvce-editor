import { runWithExtension, test, expect } from './_testFrameWork.js'

test('sample.command-provider-without-label', async () => {
  const page = await runWithExtension({
    name: 'sample.command-provider-without-label',
  })
  await page.waitForLoadState('networkidle')
  /**
   * @type{string[]}
   */
  const warnings = []
  page.on('console', (event) => {
    if (event.type() === 'warning') {
      warnings.push(event.text())
    }
  })
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('.InputBox')
  await expect(quickPickInput).toHaveValue('>')
  await quickPickInput.type('sample')
  const quickPickItemSampleCommand = quickPick.locator(
    'text=command-provider.sampleCommand'
  )
  expect(warnings).toEqual([
    '[QuickPick] item has missing label {id: command-provider.sampleCommand}',
  ])
  await quickPickItemSampleCommand.click()
})
