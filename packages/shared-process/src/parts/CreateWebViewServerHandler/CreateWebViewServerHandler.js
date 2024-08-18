import { createReadStream } from 'node:fs'
import { extname } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
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

export const createHandler = (frameAncestors, webViewRoot) => {
  const csp = GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `script-src 'self'`, `frame-ancestors ${frameAncestors}`])
  const handleRequest = async (request, response) => {
    const pathName = getPathName(request)
    const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
    const isHtml = filePath.endsWith('index.html')
    const contentType = getContentType(filePath)
    if (isHtml) {
      SetHeaders.setHeaders(response, {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Content-Security-Policy': csp,
        'Content-Type': contentType,
      })
    } else {
      // TODO figure out which of these headers are actually needed
      SetHeaders.setHeaders(response, {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
      })
    }
    await pipeline(createReadStream(filePath), response)
  }
  return handleRequest
}
