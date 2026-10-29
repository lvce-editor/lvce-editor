import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { chromium } from 'playwright'

test('notifications follow AI-native layout changes without disabling their controls', async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN })
  try {
    const page = await browser.newPage()
    await page.setContent(`
      <div class="Notification">
        <p class="NotificationMessage">Existing notification</p>
        <button class="NotificationCloseButton" onclick="this.closest('.Notification').remove()">×</button>
        <button class="NotificationOption" onclick="this.dataset.clicked = 'true'">Retry</button>
      </div>`)
    await page.addStyleTag({ content: await readFile(new URL('../../static/css/parts/Notification.css', import.meta.url), 'utf8') })

    const existingNotification = page.locator('.Notification')
    const option = page.locator('.NotificationOption')
    const closeButton = page.locator('.NotificationCloseButton')

    assert.equal(await existingNotification.evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(40, 46, 47)')
    assert.equal(await existingNotification.evaluate((element) => getComputedStyle(element).color), 'rgb(255, 255, 255)')
    assert.equal(await option.evaluate((element) => getComputedStyle(element).color), 'rgb(255, 255, 255)')

    await page.locator('body').evaluate((element) => element.insertAdjacentHTML('beforeend', '<div class="AiNativeLayout"></div>'))
    assert.equal(await existingNotification.evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(255, 255, 255)')
    assert.equal(await existingNotification.evaluate((element) => getComputedStyle(element).color), 'rgb(32, 33, 36)')
    assert.equal(await option.evaluate((element) => getComputedStyle(element).color), 'rgb(32, 33, 36)')
    assert.equal(await option.evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(232, 234, 237)')

    await page.locator('.AiNativeLayout').evaluate((element) => element.remove())
    assert.equal(await existingNotification.evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(40, 46, 47)')

    await option.click()
    assert.equal(await option.getAttribute('data-clicked'), 'true')
    await closeButton.click()
    assert.equal(await existingNotification.count(), 0)

    await page.locator('body').evaluate((element) => element.insertAdjacentHTML('beforeend', `
      <div class="AiNativeLayout"></div>
      <div class="Notification"><p class="NotificationMessage">New notification</p></div>`))
    assert.equal(await page.locator('.Notification').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(255, 255, 255)')
  } finally {
    await browser.close()
  }
})
