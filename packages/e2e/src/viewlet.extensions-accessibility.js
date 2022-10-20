import express from 'express'
import getPort from 'get-port'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

// manual accessibility tests

// extensions input
// nvda says:  "Search Extensions in Marketplace, edit blank"
// windows narrator says:  "Search Extensions in Marketplace, edit"
// orca says: "Search Extensions in Marketplace, entry"

// extensions list
// nvda says:  "extensions section"
// windows narrator says:  "extensions, group"
// orca says:  "Extensions, list with 44 items"

// extension
// nvda says: "Extension auto rename tag"
// windows narrator says: "Extension" ❌
// orca says: "Auto rename tag n/a builtin, tree level one"

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

test.skip('viewlet.extensions-accessibility', async () => {
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
  const activityBarItemExtensions = page.locator('.Extensions')
  await activityBarItemExtensions.click()
  const extensionList = page.locator('.ExtensionList')
  // TODO
  // await expect(extensions).toHaveText('No extensions found')
  marketPlaceServer.get('/api/extensions/search', (req, res) => {
    const query = req.query.q
    switch (query) {
      case 't':
      case 'te':
      case 'tes':
      case 'test':
        res.setHeader('access-control-allow-origin', '*')
        return res.json([
          {
            name: 'test extension 1',
            authorId: 'test publisher 1',
            version: '0.0.1',
            id: 'test-publisher.test-extension',
          },
          {
            name: 'test extension 2',
            authorId: 'test publisher 2',
            version: '0.0.2',
            id: 'test-publisher.test-extension',
          },
        ])
      default:
        res.status(404).end()
        console.log({ query })
        break
    }
  })
  const inputBox = page.locator('.Extensions .InputBox')
  expect(await inputBox.getAttribute('aria-label')).toBeNull()
  await expect(inputBox).toHaveAttribute('autocorrect', 'off')
  await expect(inputBox).toHaveAttribute('autocapitalize', 'off')
  await expect(inputBox).toHaveAttribute('spellcheck', 'false')
  await inputBox.type('test')

  await expect(extensionList).toHaveAttribute('aria-label', 'Extensions')
  await expect(extensionList).toHaveAttribute('tabindex', '0')

  const firstExtension = page.locator('.ExtensionListItem').nth(0)
  await expect(firstExtension).toHaveAttribute('aria-posinset', '1')
  await expect(firstExtension).toHaveAttribute('aria-setsize', '2')
  await expect(firstExtension).toHaveAttribute('role', 'listitem')

  const secondExtension = page.locator('.ExtensionListItem').nth(1)
  await expect(secondExtension).toHaveAttribute('aria-posinset', '2')
  await expect(firstExtension).toHaveAttribute('aria-setsize', '2')
  await expect(secondExtension).toHaveAttribute('role', 'listitem')

  // TODO test error behaviour
})
