import { createServer } from 'node:http'
import * as Promises from '../Promises/Promises.js'

export const start = async (port) => {
  const server = createServer()
  const { resolve, promise } = Promises.withResolvers()
  server.listen(port, resolve)
  await promise
  console.log('launched preview server')
}
