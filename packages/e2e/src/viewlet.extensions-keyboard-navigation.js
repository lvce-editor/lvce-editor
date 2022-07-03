import express from 'express'
import getPort from 'get-port'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

const runMarketPlaceServer = async (port) => {
  const app = express()
  await new Promise((resolve) => {
    app.listen(port, () => {
      resolve(undefined)
    })
  })
  return {
    get(key, value) {
      app.get(key, value)
    },
    get uri() {
      return `http://localhost:${port}`
    },
  }
}

test('viewlet.extensions-keyboard-navigation', async () => {
  const marketPlacePort = await getPort()
  const marketPlaceServer = await runMarketPlaceServer(marketPlacePort)
  const marketPlaceUri = marketPlaceServer.uri
  const dataDir = await getTmpDir()
  const page = await runWithExtension({
    env: {
      LVCE_MARKETPLACE_URL: marketPlaceUri,
      XDG_DATA_HOME: dataDir,
    },
    name: '',
  })
  const activityBarItemExtensions = page.locator(
    '[data-viewlet-id="Extensions"]'
  )
  await activityBarItemExtensions.click()
  const extensionList = page.locator('.ExtensionList')
  marketPlaceServer.get('/api/extensions/search', (req, res) => {
    const query = req.query.q
    switch (query) {
      case 't':
      case 'te':
      case 'tes':
      case 'test':
        res.setHeader('access-control-allow-origin', '*')
        res.json([
          {
            name: 'test extension 1',
            authorId: 'test publisher 1',
            version: '0.0.1',
            id: 'test-publisher.test-extension-1',
          },
          {
            name: 'test extension 2',
            authorId: 'test publisher 2',
            version: '0.0.2',
            id: 'test-publisher.test-extension-2',
          },
          {
            name: 'test extension 3',
            authorId: 'test publisher 3',
            version: '0.0.3',
            id: 'test-publisher.test-extension-3',
          },
        ])
        break
      default:
        res.status(404).end()
        console.log({ query })
        break
    }
  })
  const inputBox = page.locator('[data-viewlet-id="Extensions"] .InputBox')
  await inputBox.type('test')

  const extension = extensionList.locator('.ExtensionListItem')
  await expect(extension).toHaveCount(3)

  await page.keyboard.press('Tab')
  await expect(extensionList).toBeFocused()

  await page.keyboard.press('ArrowDown')
  const extensionOne = extensionList.locator('.ExtensionListItem').nth(0)
  await expect(extensionOne).toHaveClass(/Focused/)

  await page.keyboard.press('ArrowDown')
  const extensionTwo = extensionList.locator('.ExtensionListItem').nth(1)
  await expect(extensionTwo).toHaveClass(/Focused/)

  await page.keyboard.press('ArrowDown')
  const extensionThree = extensionList.locator('.ExtensionListItem').nth(2)
  await expect(extensionThree).toHaveClass(/Focused/)

  await page.keyboard.press('Home')
  await expect(extensionOne).toHaveClass(/Focused/)

  await page.keyboard.press('End')
  await expect(extensionThree).toHaveClass(/Focused/)

  await page.keyboard.press('Control+Tab')
  // TODO vscode uses aria-active descandent pattern so that control-tab
  // brings focus back to the input box
  // await expect(inputBox).toBeFocused()

  // TODO test page up / page down

  // TODO test scrolling
})
