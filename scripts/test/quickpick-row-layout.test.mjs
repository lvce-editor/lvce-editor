import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { chromium } from 'playwright'

test('quickpick rows clip long results and retain row geometry and hover actions', async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN })
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    await page.setContent(`
      <style>* { box-sizing: border-box } :root { --QuickPickBackground: white; --ListForeground: black }</style>
      <div class="QuickPick">
        <div class="QuickPickHeader"><input aria-label="Search" /></div>
        <div class="QuickPickItems">
          <div class="QuickPickItem QuickPickItemActive"><span class="QuickPickItemLabel">${'long-result-'.repeat(100)}</span></div>
          <div class="QuickPickItem"><span class="QuickPickItemLabel">short.ts</span><button class="QuickPickItemRemove">×</button></div>
        </div>
      </div>`)
    await page.addStyleTag({ content: await readFile(new URL('../../static/css/parts/ViewletQuickPick.css', import.meta.url), 'utf8') })
    const rows = page.locator('.QuickPickItem')
    const first = await rows.nth(0).boundingBox()
    const second = await rows.nth(1).boundingBox()
    assert.ok(first && second)
    assert.equal(first.height, 22)
    assert.equal(second.height, 22)
    assert.equal(second.y, first.y + first.height)
    assert.equal(first.width, second.width)
    assert.equal(await page.locator('.QuickPickItemRemove').isVisible(), false)
    await rows.nth(1).hover()
    assert.equal(await page.locator('.QuickPickItemRemove').isVisible(), true)
    const button = await page.locator('.QuickPickItemRemove').boundingBox()
    assert.ok(button && button.x >= second.x && button.x + button.width <= second.x + second.width)
    const overflowHit = await page.evaluate(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('.QuickPickItem')), {
      x: first.x + first.width + 10,
      y: first.y + first.height / 2,
    })
    assert.equal(overflowHit, false, 'Long result text must not receive input outside its row')
    await page.locator('input').focus()
    assert.equal(await page.locator('input').evaluate((input) => input === document.activeElement), true)
  } finally {
    await browser.close()
  }
})
