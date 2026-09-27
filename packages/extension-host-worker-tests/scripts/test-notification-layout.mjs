import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const css = await readFile(new URL('../../../static/css/parts/Notification.css', import.meta.url), 'utf8')
const iconButtonCss = await readFile(new URL('../../../static/css/parts/IconButton.css', import.meta.url), 'utf8')
const maskIconCss = await readFile(new URL('../../../static/css/parts/MaskIcon.css', import.meta.url), 'utf8')
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
    await page.setContent(`<style>* { box-sizing: border-box } body { font: 16px system-ui } ${iconButtonCss} ${maskIconCss} ${css}</style>
      <div class="Notification"><p class="NotificationMessage"></p><button class="IconButton NotificationCloseButton" aria-label="Close" title="Close"><div class="MaskIcon MaskIconClose"></div></button></div>`)
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
    if (message === 'Saved') {
      const lineAndButtonBounds = await page.evaluate(() => {
        const line = document.querySelector('.NotificationMessage').getBoundingClientRect()
        const close = document.querySelector('.NotificationCloseButton').getBoundingClientRect()
        return {
          lineCenter: line.top + Number.parseFloat(getComputedStyle(document.querySelector('.NotificationMessage')).lineHeight) / 2,
          closeCenter: close.top + close.height / 2,
        }
      })
      assert.ok(
        Math.abs(lineAndButtonBounds.lineCenter - lineAndButtonBounds.closeCenter) <= 1,
        `Close button should be vertically centered on a single line: ${JSON.stringify(lineAndButtonBounds)}`,
      )
    }
    await page.locator('.NotificationMessage').evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    assert.equal(await checkBounds(), '', 'The close button must stay visible when scrolling')
    await expect(page.locator('.NotificationCloseButton')).toBeVisible()
  }
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.setContent(`<style>* { box-sizing: border-box } body { font: 16px system-ui } ${css}
    .PreviewArea { position: fixed; top: 0; bottom: 0; background: gray }
  </style>
  <div class="PreviewArea"></div>
  <div class="Widgets"><div class="Notification"><p class="NotificationMessage">Continue signing in</p><button class="NotificationCloseButton">Close</button></div></div>`)
  const preview = page.locator('.PreviewArea')
  const notification = page.locator('.Notification')
  for (const left of [900, 700, 500]) {
    await preview.evaluate((element, value) => {
      element.style.left = `${value}px`
      element.style.width = `${innerWidth - value}px`
      document.documentElement.style.setProperty('--NotificationRight', `calc(100vw - ${value}px + 30px)`)
      document.documentElement.style.setProperty('--NotificationMaxWidth', `min(250px, calc(${value}px - 60px), calc(100vw - 60px))`)
    }, left)
    const previewBounds = await preview.boundingBox()
    const notificationBounds = await notification.boundingBox()
    assert.ok(notificationBounds.x + notificationBounds.width <= previewBounds.x - 29, `Notification overlaps Simple Browser at split x=${left}`)
  }
  await preview.evaluate((element) => {
    element.remove()
    document.documentElement.style.setProperty('--NotificationRight', '30px')
    document.documentElement.style.setProperty('--NotificationMaxWidth', 'min(250px, calc(100vw - 60px))')
  })
  const notificationBounds = await notification.boundingBox()
  assert.ok(notificationBounds.x + notificationBounds.width <= 1250, 'Notification remains within the IDE viewport after closing Simple Browser')
  console.log('Notification text wraps, stays within the viewport, and moves with the IDE boundary beside Simple Browser')
} finally {
  await browser.close()
}
