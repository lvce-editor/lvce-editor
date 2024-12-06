import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { ServerResponse } from 'node:http'
import { pipeline } from 'node:stream/promises'
import * as Assert from '../Assert/Assert.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'

const supportsStream = (filePath) => {
  if (filePath.endsWith('.ttf')) {
    return false
  }
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
    await pipeline(stream, response)
  } catch (error) {
    console.error(`[response error] ${request.url} ${error}`)
    response.statusCode = 500
    response.end('server error')
  }
}
