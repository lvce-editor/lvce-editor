import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { ServerResponse } from 'node:http'
import { pipeline, finished } from 'node:stream/promises'
import * as Assert from '../Assert/Assert.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'

const supportsStream = (filePath) => {
  // if (filePath.endsWith('.ttf')) {
  //   return false
  // }
  return true
}

export const send = async (request, socket, filePath) => {
  const response = new ServerResponse(request)
  try {
    Assert.object(request)
    Assert.object(socket)
    Assert.string(filePath)
    response.assignSocket(socket)
    const headers = GetHeaders.getHeaders(filePath)
    response.writeHead(200, headers)
    if (!supportsStream(filePath)) {
      const content = await readFile(filePath)
      response.end(content)
      return
    }
    const stream = createReadStream(filePath)
    if (filePath.endsWith('.ttf')) {
      console.log('before font stream')
      stream.on('close', () => {
        console.log('read close')
      })
      stream.on('end', () => {
        console.log('stream end')
      })
      stream.on('data', (x) => {
        console.log(x)
        console.log('stream data')
      })
      response.on('finish', () => {
        console.log('response finish')
      })
      response.on('close', () => {
        console.log('response closed')
      })
      // await finished(stream)
      // console.log('did finish')
    }
    await pipeline(stream, response, { end: false })
    response.end()
    if (filePath.endsWith('.ttf')) {
      await new Promise((r) => {
        setTimeout(r, 2000)
      })
      console.log('after font stream')
    }
  } catch (error) {
    console.error(`[response error] ${request.url} ${error}`)
    response.statusCode = 500
    response.end('server error')
  }
}
