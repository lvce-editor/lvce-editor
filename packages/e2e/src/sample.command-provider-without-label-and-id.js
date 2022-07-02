import { runWithExtension, expect, test } from './_testFrameWork.js'

test('sample.command-provider-without-label-and-id', async () => {
  const page = await runWithExtension({
    name: 'sample.command-provider-without-label-and-id',
  })
  await page.waitForLoadState('networkidle')
  /**
   * @type {string[]}
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
  // TODO warnings should be more useful, probably also in shared process logs (getCommands)
  expect(warnings).toEqual([
    '[QuickPick] item has missing label {}',
    '[QuickPick] item has missing id {}',
    '[QuickPick] item has missing label {id: ext.undefined, label: undefined}',
  ])
})
