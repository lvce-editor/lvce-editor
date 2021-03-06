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

test.skip('viewlet.extensions-marketplace-search-error-extension-null', async () => {
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
    '.ActivityBarItem[data-viewlet-id="Extensions"]'
  )
  await activityBarItemExtensions.click()
  marketPlaceServer.get('/api/extensions/search', (req, res) => {
    const query = req.query.q
    res.setHeader('Access-Control-Allow-Origin', '*')
    switch (query) {
      case 't':
      case 'te':
      case 'tes':
      case 'test':
        return res.json([
          null,
          {
            name: 'test extension 1',
            authorId: 'test publisher 1',
            version: '0.0.1',
            id: 'test-publisher.test-extension',
          },
        ])
      default:
        res.status(404).end()
        break
    }
  })
  const viewletExtensions = page.locator(
    '.Viewlet[data-viewlet-id="Extensions"]'
  )
  const viewletExtensionsInputBox = viewletExtensions.locator('.InputBox')
  await viewletExtensionsInputBox.click()
  await viewletExtensionsInputBox.type('test')
  const extension = page.locator('.ExtensionListItem')
  await expect(extension).toHaveCount(1)
  const extensionName = extension.locator('.ExtensionName')
  await expect(extensionName).toHaveText('test extension 1')
  const extensionDescription = extension.locator('.ExtensionDescription')
  await expect(extensionDescription).toHaveText('n/a')
  const extensionAuthorName = extension.locator('.ExtensionAuthorName')
  await expect(extensionAuthorName).toHaveText('n/a')
})
