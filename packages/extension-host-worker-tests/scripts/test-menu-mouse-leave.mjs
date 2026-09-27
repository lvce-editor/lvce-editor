import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { chromium, expect } from '@playwright/test'
import cors from 'cors'
import express from 'express'

const root = resolve(import.meta.dirname, '../../..')
const app = express()
app.use(cors({}))
app.use(express.static(resolve(root, 'packages/build/.tmp/export-test/dist')))

const server = app.listen(0, '127.0.0.1')
await new Promise((resolve, reject) => {
  server.once('listening', resolve)
  server.once('error', reject)
})

const address = server.address()
if (!address || typeof address === 'string') {
  throw new Error('Expected the test server to listen on a TCP port')
}

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  await page.goto(`http://127.0.0.1:${address.port}/index.html`)

  const helpMenuItem = page.locator('.TitleBarTopLevelEntry', { hasText: 'Help' })
  await helpMenuItem.click()

  const menu = page.locator('#Menu-0')
  await expect(menu).toBeVisible()

  const aboutItem = page.locator('#Menu-0 .MenuItem', { hasText: 'About' })
  await aboutItem.hover()
  await expect(aboutItem).toHaveClass(/MenuItemFocused/)

  await page.locator('.Main').hover()
  await expect(menu).toBeVisible()
  await expect(page.locator('.MenuItemFocused')).toHaveCount(0)

  await aboutItem.hover()
  await expect(aboutItem).toHaveClass(/MenuItemFocused/)
} finally {
  await browser.close()
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
}
