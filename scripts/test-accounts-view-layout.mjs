import assert from 'node:assert/strict'

export const test = async ({ page }) => {
  const accounts = page.locator('.Accounts')
  const main = page.locator('.Main')
  const expectAccountsToFillMain = async () => {
    const accountsBox = await accounts.boundingBox()
    const mainBox = await main.boundingBox()
    assert.ok(accountsBox)
    assert.ok(mainBox)
    assert.ok(accountsBox.width > mainBox.width * 0.9)
  }

  await expectAccountsToFillMain()
  await page.setViewportSize({ width: 800, height: 600 })
  await expectAccountsToFillMain()
}
