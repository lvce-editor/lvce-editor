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

test('viewlet.extensions-marketplace-search-error-404', async () => {
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
  // await expect(viewletExtensions).toHaveText('No extensions found')
  marketPlaceServer.get('/api/extensions/search', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const query = req.params.q
    switch (query) {
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
  // TODO error message should include request url
  await expect(extensionList).toHaveText(
    'Failed to load extensions from marketplace: HTTPError: Request failed with status code 404 Not Found'
  )
})
