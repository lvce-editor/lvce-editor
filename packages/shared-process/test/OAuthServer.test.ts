import { expect, test } from '@jest/globals'
import * as http from 'node:http'
import * as OAuthServer from '../src/parts/OAuthServer/OAuthServer.js'

const successHtml = '<html><body>success</body></html>'
const errorHtml = '<html><body>error</body></html>'

const getResponse = async (port, path = '/') => {
  const response = await new Promise<http.IncomingMessage>((resolve, reject) => {
    const request = http.get(`http://localhost:${port}${path}`, resolve)
    request.on('error', reject)
  })

  const chunks: Uint8Array[] = []
  response.on('data', (chunk) => {
    chunks.push(chunk)
  })

  await new Promise((resolve) => {
    response.on('end', resolve)
  })

  return {
    body: Buffer.concat(chunks).toString(),
    response,
  }
}

test('create returns ephemeral localhost port and is idempotent per id', async () => {
  const port = await OAuthServer.create('window-1', successHtml, errorHtml)
  expect(port).toBeGreaterThan(0)

  const secondPort = await OAuthServer.create('window-1', successHtml, errorHtml)
  expect(secondPort).toBe(port)

  const { body, response } = await getResponse(port)
  expect(response.statusCode).toBe(200)
  expect(body).toBe(errorHtml)

  await OAuthServer.dispose('window-1')
})

test('getCode resolves when the auth request arrives after waiting', async () => {
  const port = await OAuthServer.create('window-1', successHtml, errorHtml)

  const codePromise = OAuthServer.getCode('window-1')
  const { body, response } = await getResponse(port, '/?code=auth-code-1&state=test-state')

  expect(response.statusCode).toBe(200)
  expect(body).toBe(successHtml)
  await expect(codePromise).resolves.toBe('auth-code-1')

  await OAuthServer.dispose('window-1')
})

test('getCode returns queued auth code when request arrives before waiting', async () => {
  const port = await OAuthServer.create('window-1', successHtml, errorHtml)

  const { body, response } = await getResponse(port, '/?code=auth-code-2')

  expect(response.statusCode).toBe(200)
  expect(body).toBe(successHtml)
  await expect(OAuthServer.getCode('window-1')).resolves.toBe('auth-code-2')

  await OAuthServer.dispose('window-1')
})

test('request without authorization code returns configured error html', async () => {
  const port = await OAuthServer.create('window-1', successHtml, errorHtml)

  const { body, response } = await getResponse(port, '/?error=access_denied')

  expect(response.statusCode).toBe(200)
  expect(body).toBe(errorHtml)

  await OAuthServer.dispose('window-1')
})

test('create supports multiple ids with independent servers', async () => {
  const firstPort = await OAuthServer.create('window-1', successHtml, errorHtml)
  const secondPort = await OAuthServer.create('window-2', successHtml, errorHtml)

  expect(firstPort).toBeGreaterThan(0)
  expect(secondPort).toBeGreaterThan(0)
  expect(firstPort).not.toBe(secondPort)

  const { body: firstBody, response: firstResponse } = await getResponse(firstPort)
  const { body: secondBody, response: secondResponse } = await getResponse(secondPort)

  expect(firstResponse.statusCode).toBe(200)
  expect(secondResponse.statusCode).toBe(200)
  expect(firstBody).toBe(errorHtml)
  expect(secondBody).toBe(errorHtml)

  await OAuthServer.dispose('window-1')
  await OAuthServer.dispose('window-2')
})
