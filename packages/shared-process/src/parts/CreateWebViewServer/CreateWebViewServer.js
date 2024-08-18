import { VError } from '@lvce-editor/verror'
import { createReadStream } from 'node:fs'
import { createServer } from 'node:http'
import { extname } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as Promises from '../Promises/Promises.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'

const getPathName = (request) => {
  const { pathname } = new URL(request.url || '', `https://${request.headers.host}`)
  return pathname
}

const textMimeType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.ts': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.woff': 'application/font-woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpe': 'image/jpg',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpg',
  '.jpg': 'image/jpg',
  '.webp': 'image/webp',
}

const getContentType = (filePath) => {
  return textMimeType[extname(filePath)] || 'text/plain'
}

export const createWebViewServer = async (port, frameAncestors, webViewRoot) => {
  try {
    const server = createServer(handleRequest)
    // server.
    const { resolve, promise } = Promises.withResolvers()
    server.listen(port, resolve)
    await promise
    console.log('launched preview server')
    return {
      setHandler(handleRequest) {
        server.on('request', handleRequest)
      },
    }
  } catch (error) {
    throw new VError(error, `Failed to start webview server`)
  }
}
