import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as WebSocketCapability from '../WebSocketCapability/WebSocketCapability.ts'
import * as WebSocketIssuerRegistry from '../WebSocketIssuerRegistry/WebSocketIssuerRegistry.ts'

const jsonHeaders = {
  [HttpHeader.CacheControl]: 'no-store',
  [HttpHeader.ContentType]: 'application/json; charset=utf-8',
}

const getResponse = (status: number, value: unknown): any => {
  return {
    body: Buffer.from(JSON.stringify(value)),
    init: {
      headers: jsonHeaders,
      status,
    },
  }
}

const getBearerToken = (authorization: unknown): string => {
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    return ''
  }
  return authorization.slice('Bearer '.length)
}

export const getWebSocketCapabilityResponse = (request: any): any => {
  if (request.method !== 'GET') {
    return getResponse(HttpStatusCode.Forbidden, { error: 'method not allowed' })
  }
  const issuer = getBearerToken(request.headers?.authorization)
  if (!WebSocketIssuerRegistry.isValid(issuer)) {
    return getResponse(HttpStatusCode.Forbidden, { error: 'invalid websocket issuer' })
  }
  const prefix = '/websocket-capabilities/'
  try {
    const target = decodeURIComponent(request.url.slice(prefix.length).split('?')[0])
    return getResponse(HttpStatusCode.Ok, WebSocketCapability.create(target))
  } catch {
    return getResponse(HttpStatusCode.Forbidden, { error: 'websocket target not allowed' })
  }
}
