import { createReadStream } from 'node:fs'
import { extname } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'
import * as PreviewInjectedCode from '../PreviewInjectedCode/PreviewInjectedCode.js'
import { readFile } from 'node:fs/promises'

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

const injectPreviewScript = (html) => {
  const injectedCode = `<script type="module" src="/preview-injected.js"></script>\n`
  const titleEndIndex = html.indexOf('</title>')
  const newHtml = html.slice(0, titleEndIndex + '</title>'.length) + '\n' + injectedCode + html.slice(titleEndIndex)
  return newHtml
}

const handleIndexHtml = async (response, filePath, frameAncestors) => {
  try {
    const csp = GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `script-src 'self'`, `frame-ancestors ${frameAncestors}`])
    const contentType = getContentType(filePath)
    const content = await readFile(filePath, 'utf8')
    SetHeaders.setHeaders(response, {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Content-Security-Policy': csp,
      'Content-Type': contentType,
    })
    const newContent = injectPreviewScript(content)
    response.end(newContent)
  } catch (error) {
    console.error(`[preview-server] ${error}`)
  }
}

const handleOther = async (response, filePath) => {
  try {
    const contentType = getContentType(filePath)
    // TODO figure out which of these headers are actually needed
    SetHeaders.setHeaders(response, {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType,
    })
    await pipeline(createReadStream(filePath), response)
  } catch (error) {
    console.error(error)
    response.end(`[preview-server] ${error}`)
  }
}

const handlePreviewInjected = (response) => {
  try {
    const injectedCode = PreviewInjectedCode.injectedCode
    const contentType = getContentType('/test/file.js')
    SetHeaders.setHeaders(response, {
      'Content-Type': contentType,
    })
    response.end(injectedCode)
  } catch (error) {
    console.error(`[preview-server] ${error}`)
  }
}

export const createHandler = (frameAncestors, webViewRoot) => {
  const handleRequest = async (request, response) => {
    let pathName = getPathName(request)
    if (pathName === '/') {
      pathName += 'index.html'
    }
    const filePath = fileURLToPath(`file://${webViewRoot}${pathName}`)
    const isHtml = filePath.endsWith('index.html')
    if (isHtml) {
      return handleIndexHtml(response, filePath, frameAncestors)
    }
    if (filePath.endsWith('preview-injected.js')) {
      return handlePreviewInjected(response)
    }
    return handleOther(response, filePath)
  }
  return handleRequest
}
