import { afterEach, expect, test } from '@jest/globals'
import * as GetWebSocketCapabilityResponse from '../src/parts/GetWebSocketCapabilityResponse/GetWebSocketCapabilityResponse.ts'
import * as WebSocketCapabilityRegistry from '../src/parts/WebSocketCapabilityRegistry/WebSocketCapabilityRegistry.ts'
import * as WebSocketIssuerRegistry from '../src/parts/WebSocketIssuerRegistry/WebSocketIssuerRegistry.ts'

const capabilityProtocolRegex = /^lvce-capability\.[A-Za-z0-9_-]{43}$/

afterEach(() => {
  WebSocketCapabilityRegistry.clear()
  WebSocketIssuerRegistry.clear()
})

const createRequest = (issuer: string, target = 'shared-process'): any => ({
  headers: {
    authorization: `Bearer ${issuer}`,
  },
  method: 'GET',
  url: `/websocket-capabilities/${target}`,
})

test('mints a no-store one-use capability for an authenticated issuer', () => {
  const issuer = WebSocketIssuerRegistry.create()

  const response = GetWebSocketCapabilityResponse.getWebSocketCapabilityResponse(createRequest(issuer))
  const result = JSON.parse(response.body.toString())

  expect(response.init).toEqual(
    expect.objectContaining({
      headers: expect.objectContaining({ 'Cache-Control': 'no-store' }),
      status: 200,
    }),
  )
  expect(result).toEqual({
    protocols: ['lvce-rpc', expect.stringMatching(capabilityProtocolRegex)],
    url: '/websocket/capability',
  })
})

test('rejects missing issuers and disallowed targets', () => {
  const invalidIssuerResponse = GetWebSocketCapabilityResponse.getWebSocketCapabilityResponse(createRequest('invalid'))
  expect(invalidIssuerResponse.init.status).toBe(403)

  const issuer = WebSocketIssuerRegistry.create()
  const invalidTargetResponse = GetWebSocketCapabilityResponse.getWebSocketCapabilityResponse(createRequest(issuer, 'unknown-process'))
  expect(invalidTargetResponse.init.status).toBe(403)
})

test('rejects malformed target encodings', () => {
  const issuer = WebSocketIssuerRegistry.create()
  const request = createRequest(issuer)
  request.url = '/websocket-capabilities/%'

  const response = GetWebSocketCapabilityResponse.getWebSocketCapabilityResponse(request)

  expect(response.init.status).toBe(403)
})
