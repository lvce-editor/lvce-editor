import { expect, test } from '@jest/globals'
import * as http from 'node:http'
import * as OAuthServer from '../src/parts/OAuthServer/OAuthServer.js'

test('create returns ephemeral localhost port and is idempotent', async () => {
  const port = await OAuthServer.create()
  expect(port).toBeGreaterThan(0)

  const secondPort = await OAuthServer.create()
  expect(secondPort).toBe(port)

  const response = await new Promise<http.IncomingMessage>((resolve, reject) => {
    const request = http.get(`http://localhost:${port}`, resolve)
    request.on('error', reject)
  })

  await new Promise((resolve) => {
    response.resume()
    response.on('end', resolve)
  })

  expect(response.statusCode).toBe(200)
  await OAuthServer.dispose()
})
