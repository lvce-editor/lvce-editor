import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { chromium } from 'playwright'

test('notifications follow AI-native layout changes without disabling their controls', async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN })
  try {
    const page = await browser.newPage({ viewport: { width: 1024, height: 768 } })
    await page.setContent(`
      <div class="Notification">
        <p class="NotificationMessage">Existing notification</p>
        <button class="NotificationCloseButton" onclick="this.closest('.Notification').remove()">×</button>
        <button class="NotificationOption" onclick="this.dataset.clicked = 'true'">Retry</button>
      </div>`)
    await page.addStyleTag({ content: await readFile(new URL('../../static/css/parts/Notification.css', import.meta.url), 'utf8') })

    await page.locator('body').evaluate((element) => element.insertAdjacentHTML('beforeend', `
      <div id="Workbench" style="--NotificationRight: 30px; --NotificationMaxWidth: min(350px, calc(100vw - 60px))">
        <div class="Widgets"><div class="Notification"><p class="NotificationMessage">A longer notification message</p></div></div>
      </div>`))
    const widgetNotification = page.locator('#Workbench .Widgets > .Notification')
    assert.equal(await widgetNotification.evaluate((element) => element.getBoundingClientRect().width), 350)

    await page.locator('#Workbench').evaluate((element) => element.setAttribute('style', '--NotificationRight: calc(100vw - 300px + 30px); --NotificationMaxWidth: min(350px, calc(300px - 60px), calc(100vw - 60px))'))
    const previewConstrainedBox = await widgetNotification.boundingBox()
    assert.equal(previewConstrainedBox.width, 240)
    assert.equal(previewConstrainedBox.x + previewConstrainedBox.width, 270)
    await page.setViewportSize({ width: 300, height: 768 })
    await page.locator('#Workbench').evaluate((element) => element.setAttribute('style', '--NotificationRight: 30px; --NotificationMaxWidth: min(350px, calc(100vw - 60px))'))
    assert.equal(await widgetNotification.evaluate((element) => element.getBoundingClientRect().width), 240)
    await page.locator('#Workbench').evaluate((element) => element.remove())

    const existingNotification = page.locator('body > .Notification')
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
    assert.equal(await page.locator('body > .Notification').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(255, 255, 255)')
  } finally {
    await browser.close()
  }
})
