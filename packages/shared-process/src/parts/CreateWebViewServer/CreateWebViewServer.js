import { createServer } from 'node:http'
import * as Promises from '../Promises/Promises.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import { VError } from '@lvce-editor/verror'

export const createWebViewServer = async (port, frameAncestors) => {
  try {
    const csp = GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `script-src 'self'`, `frame-ancestors ${frameAncestors}`])
    const server = createServer((req, res) => {
      SetHeaders.setHeaders(res, {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Content-Security-Policy': csp,
      })
      res.end('<button>ok</button>')
    })
    const { resolve, promise } = Promises.withResolvers()
    server.listen(port, resolve)
    await promise
    console.log('launched preview server')
  } catch (error) {
    throw new VError(error, `Failed to start webview server`)
  }
}
