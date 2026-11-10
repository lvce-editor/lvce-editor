import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { chromium, firefox } from 'playwright'

// Theme colors may omit EditorBackground, as the default web theme does.
// Compare actual header pixels with/without the rows behind it: a transparent
// sticky header keeps its coordinates but lets those rows paint through.
for (const browserType of [chromium, firefox]) {
  test(`${browserType.name()}: Workers headers cover scrolling tree and selected rows`, async () => {
    const browser = await browserType.launch({ headless: true })
    try {
      const page = await browser.newPage({ viewport: { width: 800, height: 240 } })
      await page.setContent(`
        <style>
          * { box-sizing: border-box }
          html, body { margin: 0; height: 100%; font-family: sans-serif }
          :root { --MainBackground: #212425; --WorkbenchForeground: #ddd; --ListActiveSelectionBackground: #516059 }
          body { background: var(--MainBackground) }
          .WorkersViewDisclosure { width: 16px; padding: 0; border: 0; background: transparent }
          .WorkersViewIndent-2 { padding-left: 16px }
        </style>
        <div class="WorkersView"><div class="WorkersViewTableContainer"><table class="WorkersViewTable" tabindex="0"></table></div></div>`)
      await page.addStyleTag({ content: await readFile(new URL('../../static/css/parts/ViewletWorkers.css', import.meta.url), 'utf8') })
      // The virtual DOM creates rows directly under the table, without a thead.
      await page.locator('table').evaluate((table) => {
        const header = document.createElement('tr')
        header.className = 'WorkersViewTableHeaderRow'
        header.innerHTML =
          '<th class="WorkersViewTableHeaderCell"><button class="WorkersViewTableHeaderButton">Name</button></th><th class="WorkersViewTableHeaderCell"><button class="WorkersViewTableHeaderButton">Heap Use</button></th>'
        table.append(header)
        for (let index = 0; index < 40; index++) {
          const row = document.createElement('tr')
          row.className = 'WorkersViewWorkerRow WorkersViewWorkerRowSelected WorkersViewWorkerRowFocused'
          row.innerHTML = `<td class="WorkersViewWorkerCell WorkersViewNameCell WorkersViewIndent-2"><button class="WorkersViewDisclosure">▾</button><span>Worker ${index}</span></td><td class="WorkersViewWorkerCell">${index} MB</td>`
          table.append(row)
        }
      })
      for (const width of [800, 360]) {
        await page.setViewportSize({ width, height: 120 })
        for (const scrollTop of [50, 83, 200, 0]) {
          await page.locator('.WorkersViewTableContainer').evaluate((element, offset) => {
            element.scrollTop = offset
          }, scrollTop)
          const header = page.locator('.WorkersViewTableHeaderRow')
          // Capture the sticky cells' viewport area, not the non-sticky row box.
          const first = await page.locator('th').first().boundingBox()
          const last = await page.locator('th').last().boundingBox()
          assert.ok(first && last)
          assert.equal(first.y, 0)
          const clip = { x: first.x, y: first.y, width: last.x + last.width - first.x, height: first.height - 1 }
          const visible = await page.screenshot({ clip })
          await page.addStyleTag({ content: '.WorkersViewWorkerRow { visibility: hidden }' })
          const hidden = await page.screenshot({ clip })
          await page
            .locator('style')
            .last()
            .evaluate((style) => style.remove())
          assert.deepEqual(visible, hidden, `Rows must not paint through headers at width ${width}, scroll ${scrollTop}`)
          assert.equal(await header.getByRole('button', { name: 'Name', exact: true }).isVisible(), true)
        }
      }
      await page.getByRole('button', { name: 'Name', exact: true }).focus()
      await page.keyboard.press('Tab')
      assert.equal(await page.getByRole('button', { name: 'Heap Use' }).evaluate((button) => button === document.activeElement), true)
    } finally {
      await browser.close()
    }
  })
}
