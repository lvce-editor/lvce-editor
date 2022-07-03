import express from 'express'
import getPort from 'get-port'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

const runMarketPlaceServer = async (port) => {
  // let implementation = (req, res) => {
  //   res.end('ok')
  // }
  const app = express()
  // const server = http.createServer((req, res) => {
  //   implementation(req, res)
  // })
  await new Promise((resolve) => {
    app.listen(port, () => {
      resolve(undefined)
    })
  })
  return {
    // get implementation() {
    //   return implementation
    // },
    // set implementation(value) {
    //   implementation = value
    // },
    get(key, value) {
      app.get(key, value)
    },
    get uri() {
      return `http://localhost:${port}`
    },
  }
}

test.skip('viewlet.extensions-marketplace-search-no-results', async () => {
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
  await viewletExtensionsInputBox.type('test')
  const extensionList = page.locator('.ExtensionList')
  await expect(extensionList).toHaveText('No extensions found.')
})
