import { expect, test } from '@jest/globals'
import * as http from 'node:http'
import * as OAuthServer from '../src/parts/OAuthServer/OAuthServer.js'

const getResponse = async (port) => {
  const response = await new Promise<http.IncomingMessage>((resolve, reject) => {
    const request = http.get(`http://localhost:${port}`, resolve)
    request.on('error', reject)
  })

  await new Promise((resolve) => {
    response.resume()
    response.on('end', resolve)
  })

  return response
}

test('create returns ephemeral localhost port and is idempotent per id', async () => {
  const port = await OAuthServer.create('window-1')
  expect(port).toBeGreaterThan(0)

  const secondPort = await OAuthServer.create('window-1')
  expect(secondPort).toBe(port)

  const response = await getResponse(port)
  expect(response.statusCode).toBe(200)

  await OAuthServer.dispose('window-1')
})

test('create supports multiple ids with independent servers', async () => {
  const firstPort = await OAuthServer.create('window-1')
  const secondPort = await OAuthServer.create('window-2')

  expect(firstPort).toBeGreaterThan(0)
  expect(secondPort).toBeGreaterThan(0)
  expect(firstPort).not.toBe(secondPort)

  const firstResponse = await getResponse(firstPort)
  const secondResponse = await getResponse(secondPort)

  expect(firstResponse.statusCode).toBe(200)
  expect(secondResponse.statusCode).toBe(200)

  await OAuthServer.dispose('window-1')
  await OAuthServer.dispose('window-2')
})
