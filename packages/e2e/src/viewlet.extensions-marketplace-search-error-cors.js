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

test('viewlet.extensions-marketplace-search-error-cors', async () => {
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
    const query = req.params.q
    switch (query) {
      case 't':
        return res.json([])
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
  await viewletExtensionsInputBox.type('t')
  const extensionList = page.locator('.ExtensionList')
  // TODO error message could be more concise
  await expect(extensionList).toHaveText(
    `Failed to load extensions from marketplace: Error: Failed to request json from \"${marketPlaceUri}/api/extensions/search\". Make sure that the server has CORS enabled`
  )
})
