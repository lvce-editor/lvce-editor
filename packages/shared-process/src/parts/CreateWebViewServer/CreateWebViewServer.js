import { createServer } from 'node:http'
import * as Promises from '../Promises/Promises.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'
import { VError } from '@lvce-editor/verror'

export const createWebViewServer = async (port) => {
  try {
    const server = createServer((req, res) => {
      SetHeaders.setHeaders(res, {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      })
      res.end('ok')
    })
    const { resolve, promise } = Promises.withResolvers()
    server.listen(port, resolve)
    await promise
    console.log('launched preview server')
  } catch (error) {
    throw new VError(error, `Failed to start webview server`)
  }
}
