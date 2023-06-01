const ElectronSessionGetAbsolutePath = require('../ElectronSessionGetAbsolutePath/ElectronSessionGetAbsolutePath.js')
const { net } = require('electron')
const { extname } = require('node:path')
const { pathToFileURL } = require('node:url')
const { readFileSync } = require('original-fs')

const getResponseFetch = (path) => {
  const url = pathToFileURL(path)
  const response = net.fetch(url)
  return response
}

const getMime = (path) => {
  const extension = extname(path)
  switch (extension) {
    case '.js':
      return 'application/javascript'
    case '.html':
      return 'text/html'
    case '.css':
      return 'text/css'
    default:
      return ''
  }
}

const getResponseReadFile = (path) => {
  const content = readFileSync(path)
  const mime = getMime(path)
  // console.log({ path, mime, ext: extname(path) })
  return new Response(content, { headers: { 'content-type': mime } })
}

const getResponse = getResponseFetch
/**
 *
 * @param {globalThis.Electron.ProtocolRequest} request
 */

exports.handleRequest = async (request) => {
  // console.log('url', request.url)
  const path = ElectronSessionGetAbsolutePath.getAbsolutePath(request.url)
  // console.time(url.toString())
  const response = await getResponse(path)
  // console.timeEnd(url.toString())
  return response
}
