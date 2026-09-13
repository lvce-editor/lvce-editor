import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { getUrl } from '../packages/renderer-worker/src/parts/SimpleBrowserNewTabPage/SimpleBrowserNewTabPage.js'

const requireTests = createRequire(new URL('../packages/extension-host-worker-tests/package.json', import.meta.url))
const { chromium } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const errors = []
  const queries = []
  const pending = new Map()
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('https://suggestqueries.google.com/complete/search?*', async (route) => {
    const url = new URL(route.request().url())
    const query = url.searchParams.get('q')
    const callback = url.searchParams.get('callback')
    queries.push(query)
    const respond = async () => {
      if (query === 'offline') {
        await route.abort('failed')
        return
      }
      const values = query === 'markup' ? ['<img src=x onerror=alert(1)>', '', 42, 'duplicate', 'duplicate'] : [query + ' first', query + ' second']
      const data = query === 'malformed' ? {} : [query, values]
      await route.fulfill({
        headers: { 'Content-Type': 'text/javascript; charset=UTF-8', 'Content-Disposition': 'attachment; filename="f.txt"' },
        body: `${callback} && ${callback}(${JSON.stringify(data)})`,
      })
    }
    if (['slow', 'dismiss', 'blur', 'clear'].includes(query)) pending.set(query, respond)
    else await respond()
  })
  await page.route('https://www.google.com/search?*', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Search results</title>' }))
  const newTab = getUrl('', true)
  const input = page.getByRole('combobox', { name: 'Search with Google' })
  const list = page.getByRole('listbox', { name: 'Google suggestions' })
  const options = page.getByRole('option')
  await page.goto(newTab)
  await input.fill('ca')
  await input.fill('cat')
  await expect(options).toHaveText(['cat first', 'cat second'])
  assert.deepEqual(queries, ['cat'])
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await input.press('ArrowDown')
  await expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-0')
  await input.press('ArrowDown')
  await input.press('ArrowUp')
  await input.press('Enter')
  await expect(page).toHaveURL('https://www.google.com/search?q=cat+first')

  await page.goto(newTab)
  await input.fill('mouse & keyboard')
  await options.nth(1).click()
  await expect(page).toHaveURL('https://www.google.com/search?q=mouse+%26+keyboard+second')

  await page.goto(newTab)
  await input.fill('slow')
  await expect.poll(() => pending.has('slow')).toBe(true)
  await input.fill('fast')
  await expect(options).toHaveText(['fast first', 'fast second'])
  await pending.get('slow')()
  await expect(options).toHaveText(['fast first', 'fast second'])
  await input.press('Escape')
  await expect(list).toBeHidden()
  await expect(input).toHaveValue('fast')
  await expect(input).not.toHaveAttribute('aria-activedescendant')

  for (const query of ['dismiss', 'blur', 'clear']) {
    await input.fill(query)
    await expect.poll(() => pending.has(query)).toBe(true)
    if (query === 'dismiss') await input.press('Escape')
    if (query === 'blur') await input.evaluate((element) => element.blur())
    if (query === 'clear') await input.fill('')
    await pending.get(query)()
    await expect(list).toBeHidden()
    await expect.poll(() => page.evaluate(() => Object.keys(window.lvceGoogleSuggestions).length)).toBe(0)
  }

  await input.fill('markup')
  await expect(options).toHaveText(['<img src=x onerror=alert(1)>', 'duplicate'])
  await expect(list.locator('img')).toHaveCount(0)
  await input.fill('malformed')
  await expect.poll(() => queries.includes('malformed')).toBe(true)
  await expect(list).toBeHidden()
  await input.fill('offline')
  await expect.poll(() => queries.includes('offline')).toBe(true)
  await expect(list).toBeHidden()
  await input.press('Enter')
  await expect(page).toHaveURL('https://www.google.com/search?q=offline')

  await page.goto(newTab)
  await input.focus()
  await input.dispatchEvent('compositionstart')
  await input.fill('composition')
  await page.waitForTimeout(200)
  assert(!queries.includes('composition'))
  await input.dispatchEvent('compositionend')
  await expect(options).toHaveText(['composition first', 'composition second'])
  await input.press('ArrowDown')
  await input.press('ArrowUp')
  await input.press('Enter')
  await expect(page).toHaveURL('https://www.google.com/search?q=composition')

  await page.goto(getUrl('', false))
  const disabledInput = page.getByRole('searchbox', { name: 'Search with Google' })
  const beforeDisabled = queries.length
  await disabledInput.fill('disabled')
  await page.waitForTimeout(200)
  assert.equal(queries.length, beforeDisabled)
  await expect(page.locator('script')).toHaveCount(0)
  await disabledInput.press('Enter')
  await expect(page).toHaveURL('https://www.google.com/search?q=disabled')
  assert.deepEqual(errors, [])
  console.log('Simple Browser new-tab suggestions passed')
} finally {
  await browser.close()
}
