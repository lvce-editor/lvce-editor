import { createReadStream } from 'node:fs'
import { ServerResponse } from 'node:http'
import { dirname, join, resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../')
const STATIC = resolve(__dirname, '../../../static')

const handleMessageFromParent = async (message, socket) => {
  if (!socket) {
    // socket got closed
    console.log('socket got closed')
    return
  }

  const request = message.params[0]
  const pathname = request.url
  const filePath = join(STATIC, pathname)

  const stream = createReadStream(filePath)
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  response.statusCode = 200
  response.setHeader('Connection', 'close')
  await pipeline(stream, response)
  console.log('did send')

  // response.detachSocket(socket)
  // console.log({ request })
  // console.log('got message', message)
}

const main = () => {
  process.on('message', handleMessageFromParent)
  if (process.send) {
    process.send('ready')
  }
}

main()
