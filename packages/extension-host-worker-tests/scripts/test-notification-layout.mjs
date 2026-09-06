import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const css = await readFile(new URL('../../../static/css/parts/Notification.css', import.meta.url), 'utf8')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const cases = [
    { message: 'Saved', width: 1280, height: 720 },
    { message: 'Failed to open devcontainer workspace: DevContainerNode.cliUp failed with exit code 1', width: 1280, height: 720 },
    { message: 'Failed to open devcontainer workspace: DevContainerNode.cliUp failed with exit code 1', width: 320, height: 240 },
    { message: `Failed to open file:///${'long-path-segment'.repeat(100)}`, width: 320, height: 240 },
    { message: 'Docker was not found. Install Docker and check PATH. '.repeat(100), width: 1280, height: 320 },
  ]
  for (const { message, width, height } of cases) {
    await page.setViewportSize({ width, height })
    await page.setContent(`<style>* { box-sizing: border-box } body { font: 16px system-ui } ${css}</style>
      <div class="Notification"><p class="NotificationMessage"></p><button class="NotificationCloseButton">Close</button></div>`)
    await page.locator('.NotificationMessage').evaluate((element, text) => {
      element.textContent = text
    }, message)
    const checkBounds = async () =>
      page.evaluate(() => {
        const notification = document.querySelector('.Notification')
        const message = document.querySelector('.NotificationMessage')
        const close = document.querySelector('.NotificationCloseButton')
        const outer = notification.getBoundingClientRect()
        for (const element of [message, close]) {
          const rect = element.getBoundingClientRect()
          if (rect.left < outer.left || rect.right > outer.right || rect.top < outer.top || rect.bottom > outer.bottom) {
            return `${element.className} extends outside the notification: ${JSON.stringify({ outer: outer.toJSON(), inner: rect.toJSON() })}`
          }
        }
        if (outer.left < 0 || outer.top < 0 || outer.right > innerWidth || outer.bottom > innerHeight) {
          return 'Notification extends outside the viewport'
        }
        if (message.scrollWidth > message.clientWidth) {
          return 'Notification text overflows horizontally'
        }
        if (message.scrollHeight > message.clientHeight && getComputedStyle(message).overflowY !== 'auto') {
          return 'Long notification text is not scrollable'
        }
        return ''
      })
    assert.equal(await checkBounds(), '', `Notification must contain its text at ${width}x${height}`)
    await expect(page.locator('.NotificationMessage')).toHaveText(message)
    await page.locator('.NotificationMessage').evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    assert.equal(await checkBounds(), '', 'The close button must stay visible when scrolling')
    await expect(page.locator('.NotificationCloseButton')).toBeVisible()
  }
  console.log('Notification text wraps, stays within the viewport, and scrolls without hiding the close button')
} finally {
  await browser.close()
}
