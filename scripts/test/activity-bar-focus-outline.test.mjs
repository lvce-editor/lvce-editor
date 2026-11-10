import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { chromium } from 'playwright'

test('activity bar container hides its focus outline while focused items keep theirs', async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN })
  try {
    const page = await browser.newPage()
    await page.setContent(`
      <div class="ActivityBar" tabindex="0" role="toolbar" style="width: 96px; height: 96px">
        <div class="ActivityBarItem FocusOutline" tabindex="0">Explorer</div>
      </div>`)
    for (const file of ['ViewletActivityBar.css', 'ActivityBarItem.css', 'Focus.css']) {
      await page.addStyleTag({ content: await readFile(new URL(`../../static/css/parts/${file}`, import.meta.url), 'utf8') })
    }

    const activityBar = page.locator('.ActivityBar')
    const item = page.locator('.ActivityBarItem')

    await page.keyboard.press('Tab')
    assert.equal(await activityBar.evaluate((element) => element === document.activeElement), true)
    assert.equal(await activityBar.evaluate((element) => getComputedStyle(element).outlineStyle), 'none')

    await page.keyboard.press('Tab')
    assert.equal(await item.evaluate((element) => element === document.activeElement), true)
    assert.equal(await item.evaluate((element) => getComputedStyle(element).outlineStyle), 'solid')

    await activityBar.click({ position: { x: 80, y: 80 } })
    assert.equal(await activityBar.evaluate((element) => element === document.activeElement), true)
    assert.equal(await activityBar.evaluate((element) => getComputedStyle(element).outlineStyle), 'none')
  } finally {
    await browser.close()
  }
})
