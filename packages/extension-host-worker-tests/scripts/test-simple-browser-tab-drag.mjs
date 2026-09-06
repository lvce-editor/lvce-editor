import { _electron, expect } from '@playwright/test'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const profile = await mkdtemp(join(tmpdir(), 'lvce-tab-drag-'))
const server = createServer((request, response) => {
  const title = request.url.slice(1).replace('.html', '')
  response.writeHead(200, { 'content-type': 'text/html' })
  response.end(`<!doctype html><title>${title}</title><h1>${title}</h1>`)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const baseUrl = `http://127.0.0.1:${server.address().port}`
const env = { ...process.env, XDG_CONFIG_HOME: profile, XDG_CACHE_HOME: join(profile, 'cache') }
delete env.ELECTRON_RUN_AS_NODE
const executablePath = process.env.LVCE_TEST_EXECUTABLE || resolve(root, 'packages/build/.tmp/electron-bundle/x64/lvce-oss')
let app
try {
  app = await _electron.launch({ executablePath, args: ['--no-sandbox'], env, timeout: 30000 })
  const page = await app.firstWindow()
  await page.locator('.Workbench').waitFor()
  await page.bringToFront()
  await page.locator('.Workbench').click()
  await page.keyboard.press('F1')
  const input = page.locator('.QuickPick input')
  await input.waitFor()
  await input.fill('>Simple Browser: Open')
  await page.getByRole('option', { name: 'Simple Browser: Open', exact: true }).waitFor()
  await page.keyboard.press('Enter')
  const tabs = page.locator('.SimpleBrowserTab')
  const address = page.locator('.SimpleBrowserHeader input.InputBox')
  const newTab = page.locator('.SimpleBrowserNewTab')
  for (const title of ['One', 'Two', 'Three']) {
    if (title !== 'One') {
      const count = await tabs.count()
      await newTab.click()
      await expect(tabs).toHaveCount(count + 1)
      await expect(address).toHaveValue('')
    }
    await address.fill(`${baseUrl}/${title}.html`)
    await address.press('Enter')
    await expect(tabs.filter({ has: page.locator('.SimpleBrowserTabTitle', { hasText: title }) })).toHaveCount(1)
  }
  const titles = () => tabs.locator('.SimpleBrowserTabTitle').allTextContents()
  const tab = (title) => tabs.filter({ has: page.locator('.SimpleBrowserTabTitle', { hasText: title }) })
  const drag = async (source, target, side) => {
    const from = await source.boundingBox()
    const to = await target.boundingBox()
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
    await page.mouse.down()
    await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2, { steps: 5 })
    await page.mouse.move(to.x + (side === 'before' ? 2 : to.width - 2), to.y + to.height / 2, { steps: 10 })
  }
  await expect(tab('Two')).toHaveAttribute('draggable', 'true')
  await drag(tab('Two'), tab('One'), 'before')
  await expect(tab('One')).toHaveClass(/SimpleBrowserTabDropBefore/)
  await page.mouse.up()
  await expect.poll(titles).toEqual(['Two', 'One', 'Three'])
  await expect(address).toHaveValue(`${baseUrl}/Two.html`)
  await expect(tab('Two')).toHaveAttribute('aria-selected', 'true')

  await drag(tab('Two'), tab('Three'), 'after')
  await page.mouse.up()
  await expect.poll(titles).toEqual(['One', 'Three', 'Two'])
  await expect(address).toHaveValue(`${baseUrl}/Two.html`)

  await drag(tab('One'), tab('Two'), 'after')
  await page.keyboard.press('Escape')
  await page.mouse.up()
  await expect.poll(titles).toEqual(['One', 'Three', 'Two'])
  await expect(page.locator('.SimpleBrowserTabDropBefore, .SimpleBrowserTabDropAfter')).toHaveCount(0)

  await tab('Two').locator('.SimpleBrowserTabClose').click()
  await expect.poll(titles).toEqual(['One', 'Three'])
  await newTab.click()
  await expect(tabs).toHaveCount(3)
  await newTab.click()
  await expect.poll(titles).toEqual(['One', 'Three', 'New Tab', 'New Tab'])
  await drag(tabs.nth(2), tab('One'), 'before')
  await page.mouse.up()
  await expect.poll(titles).toEqual(['New Tab', 'One', 'Three', 'New Tab'])
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
  console.log('Simple Browser native tab dragging, reordering, cancellation, active-page preservation, and new tabs passed')
} finally {
  await app?.close()
  await new Promise((resolve) => server.close(resolve))
  await rm(profile, { recursive: true, force: true })
}
